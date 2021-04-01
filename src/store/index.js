import Vue from 'vue'
import Vuex from 'vuex'
import {Gathering} from '../models/index'
import H from './storeHelpers'
import firebase from 'firebase'

Vue.use(Vuex)

//firebase init
const fbase = firebase.initializeApp({
  apiKey: 'AIzaSyCq93DMyAPeJZWVTWA1sF-WZlBB2QXiXsk',
  authDomain: 'gather-ring-app.firebaseapp.com',
  databaseURL: 'https://gather-ring-app-default-rtdb.firebaseio.com',
  projectId: 'gather-ring-app',
  storageBucket: 'gather-ring-app.appspot.com',
  messagingSenderId: '825033355241',
  appId: '1:825033355241:web:2c914888d9ccbf3484a578',
  measurementId: 'G-B5PDNHE640'
})
const db = fbase.database()
const cFunc = fbase.functions()

export default new Vuex.Store({
  state: {
    showSecurity: false,
    route: null,
    loading: false,
    message: null,
    timer: null,
    circleSize: 25,
    user: null,
    gathering: null,
    password: null,
    currentCircle: null
  },

  // auto-generate basic mutations
  mutations: {
    ...H.basicMutations([
      'showSecurity',
      'route',
      'loading',
      'message',
      'timer',
      'circleSize',
      'user',
      'gathering',
      'password',
      'currentCircle'
    ])
  },

  actions: {
    async displayMessage({commit, state}, payload) {
      commit('SET_MESSAGE', null)
      commit('SET_LOADING', false)
      clearTimeout(state.timer)
      if (!payload) return
      commit('SET_MESSAGE', payload.msg)
      const timerRef = setTimeout(() => {
        commit('SET_MESSAGE', null)
      }, payload.time || 5000)
      commit('SET_TIMER', timerRef)
    },

    async fetchGathering({commit, state, dispatch}, id) {
      commit('SET_LOADING', true)

      const checkSecurity = cFunc.httpsCallable('checkSecurity')
      const valid = await checkSecurity({id, password: state.password})
      commit('SET_SHOW_SECURITY', false)
      if (!valid.data) {
        dispatch('displayMessage', {
          msg: 'Please enter the correct password.',
          time: 6000
        })
        commit('SET_SHOW_SECURITY', true)
        return
      }

      const gatheringRef = db.ref('gatherings/' + id)
      const handler = snapshot => {
        const val = snapshot.val()
        if (!val) {
          dispatch('displayMessage', {
            msg: 'Gathering was not found.',
            time: 12000
          })
          commit('SET_ROUTE', '')
          return
        }

        const gathering = new Gathering(
          id,
          val.name,
          val.tagline,
          val.maxSize,
          val.password,
          val.circles ? H.arrayizeCircles(val.circles) : [],
          val.users ? Object.keys(val.users) : []
        )
        commit('SET_GATHERING', gathering)
        commit('SET_ROUTE', gathering.id)
      }
      gatheringRef.get().then(val => {
        handler(val)
        setTimeout(() => { commit('SET_LOADING', false) }, 800)
        gatheringRef.on('value', handler)
      })
    },

    async createGathering({dispatch, commit}, payload) {
      commit('SET_LOADING', true)

      const newRef = db.ref('gatherings').push()
      const id = newRef.key
      const hasPass = payload.password && payload.password.length > 0
      const gathering = {
        name: payload.name,
        description: payload.description,
        maxSize: payload.maxSize,
        password: hasPass
      }
      if (hasPass) {
        db.ref(`security/${id}`).set(payload.password)
        commit('SET_PASSWORD', payload.password)
      }
      newRef.set(gathering)
      payload.circles.forEach(c => {
        const newCirclesRef = db.ref(`gatherings/${id}/circles`).push()
        newCirclesRef.set(c)
      })
      dispatch('joinGathering')
      commit('SET_ROUTE', id)
    },

    async joinGathering({state, commit}) {
      commit('SET_LOADING', true)

      const payload = state.user
      payload.user = state.user.name
      payload.password = state.password
      db.ref(`gatherings/${state.gathering.id}/users/${state.user.name}`).set(
        payload
      )
    },

    async leaveGathering({commit, state}) {
      commit('SET_LOADING', true)

      if (state.user) {
        const ref = db.ref(
          `gatherings/${state.gathering.id}/users/${state.user.name}`
        )
        if (ref) ref.remove()
        commit('SET_USER', null)
        commit('SET_GATHERING', null)
        commit('SET_PASSWORD', null)
        commit('SET_CURRENT_CIRCLE', null)
      }

      commit('SET_LOADING', false)
    },

    async addCircle({state, commit, dispatch}, payload) {
      commit('SET_LOADING', true)

      try {
        const fullPath =
          state.gathering.id +
          (state.currentCircle.parentPath || '') +
          '/circles/'
        const newRef = db.ref(`gatherings/${fullPath}`).push()

        newRef.set(payload)
        payload.id = newRef.key
        payload.password = state.password
        payload.parentPath =
          (state.currentCircle.parentPath || '') + '/circles/' + payload.id

        dispatch('joinCircle', payload)
      } catch {
        commit('SET_LOADING', false)
      }
    },

    async joinCircle({state, commit, dispatch}, circle) {
      try {
        dispatch('leaveCurrentCircle')
        commit('SET_LOADING', true)

        const circlePath = state.gathering.id + circle.parentPath
        const payload = state.user
        payload.password = state.password
        db.ref(`gatherings/${circlePath}/attendees/${state.user.name}`).set(
          payload
        )
        commit('SET_CURRENT_CIRCLE', circle)
      } catch {
        commit('SET_CURRENT_CIRCLE', null)
      }

      setTimeout(() => {
        commit('SET_LOADING', false)
      }, 2000)
    },

    async leaveCurrentCircle({state, commit}) {
      if (!state.currentCircle || !state.user) return
      const circlePath = state.gathering.id + state.currentCircle.parentPath
      const attendeeRef = db.ref(
        `gatherings/${circlePath}/attendees/${state.user.name}`
      )
      if (attendeeRef) attendeeRef.remove()
      commit('SET_CURRENT_CIRCLE', null)
    },

    async lookupCircle({state}, name) {
      if (!name || !state.gathering) return null
      const findFunc = arr => {
        return arr ? arr.find(circle => circle.name === name) : false
      }
      return H.recurseFindCircles(state.gathering.circles || [], findFunc)
    },

    async lookupAttendee({state}, name) {
      if (!name || !state.gathering) return null
      const findFunc = arr => {
        let result = null
        arr.forEach(circle => {
          if (!result && circle && circle.attendees) {
            const found = circle.attendees.find(a => a.name === name)
            if (found) {
              result = found
            }
          }
        })
        return result
      }
      return H.recurseFindCircles(state.gathering.circles || [], findFunc)
    }
  },

  getters: {
    currentParent: state => {
      if (!state.currentCircle) {
        return null
      }
      // local recursive function
      function findParentNode(circles, parentCircle) {
        return circles.find(circle => {
          if (circle.name === state.currentCircle.name) {
            return parentCircle
          }
          if (circle.circles) {
            return findParentNode(circle.circles, circle)
          }
        })
      }
      return findParentNode(state.gathering.circles)
    },
    gatheringNodes: state => {
      if (!state.gathering) return null
      const nodes = {name: state.gathering.name}

      // local recursive function
      function addChildrenNodes(circles) {
        return circles.map(circle => {
          const node = {
            name: circle.name,
            value: 3,
            children: []
          }
          if (circle.circles) {
            const circleChildren = addChildrenNodes(circle.circles)
            node.children = circleChildren
          }
          if (circle.attendees && typeof circle.attendees !== 'undefined') {
            circle.attendees.forEach(attendee => {
              node.children.push({
                name: attendee.name,
                value: 2
              })
            })
          }
          if (node.children.length < 1) delete node.children
          return node
        })
      }

      nodes.children = addChildrenNodes(state.gathering.circles)
      return nodes
    }
  }
})
