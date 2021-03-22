import Vue from 'vue'
import Vuex from 'vuex'
import {User, Gathering, Circle} from '../models/index'
import H from './storeHelpers'
import firebase from 'firebase'

Vue.use(Vuex)

//firebase init
const db = firebase
  .initializeApp({
    apiKey: 'AIzaSyCq93DMyAPeJZWVTWA1sF-WZlBB2QXiXsk',
    authDomain: 'gather-ring-app.firebaseapp.com',
    databaseURL: 'https://gather-ring-app-default-rtdb.firebaseio.com',
    projectId: 'gather-ring-app',
    storageBucket: 'gather-ring-app.appspot.com',
    messagingSenderId: '825033355241',
    appId: '1:825033355241:web:2c914888d9ccbf3484a578',
    measurementId: 'G-B5PDNHE640'
  })
  .database()

export default new Vuex.Store({
  state: {
    route: null,
    loading: true,
    message: null,
    circleSize: 25,
    user: null,
    gathering: null,
    password: '',
    currentCircle: null
  },

  // auto-generate basic mutations
  mutations: {
    ...H.basicMutations([
      'route',
      'loading',
      'message',
      'circleSize',
      'user',
      'gathering',
      'password',
      'currentCircle'
    ])
  },

  actions: {
    async displayMessage({commit}, payload) {
      commit('SET_MESSAGE', payload.msg)
      setTimeout(() => {
        commit('SET_MESSAGE', null)
      }, payload.time || 5000)
    },

    async fetchGathering({commit, dispatch}, id) {
      const gatheringRef = db.ref('gatherings/' + id)
      const handler = snapshot => {
        const val = snapshot.val()
        if (!val) {
          dispatch('displayMessage', {
            msg: 'Gathering was not found.',
            time: 8000
          })
          commit('SET_ROUTE', '')
          return
        }
        const gathering = new Gathering(
          id,
          val.name,
          val.tagline,
          val.size,
          val.password,
          Object.keys(val.admins),
          H.arrayizeCircles(val.circles)
        )
        commit('SET_GATHERING', gathering)
        commit('SET_ROUTE', gathering.id)
      }
      gatheringRef.get().then(val => {
        handler(val)
        gatheringRef.on('value', handler)
      })
    },

    async checkPassword({commit, dispatch, state}, password) {
      commit('SET_PASSWORD', password)
      // const gatheringRef = db.ref('gatherings/' + state.gathering.id)
      const valid = Math.random() > 0.5 ? false : true
      if (false || !valid) {
        //TODO:
        dispatch('displayMessage', 'Wrong password!')
      }
      return valid
    },

    async createGathering({commit}, payload) {
      const newRef = db.ref('gatherings').push()
      const id = newRef.key
      const gathering = {
        name: payload.name,
        description: payload.description,
        size: payload.size,
        password: payload.password,
        admins: payload.admins
      }
      newRef.set(gathering)
      payload.circles.forEach(c => {
        const newCirclesRef = db.ref(`gatherings/${id}/circles`).push()
        newCirclesRef.set(c)
      })
      commit('SET_ROUTE', id)
    },

    async lookupCircle({state}, name) {
      if (!name || !state.gathering) return null
      const findFunc = arr => {
        return arr.find(circle => circle.name === name)
      }
      return H.recurseFindCircles(state.gathering.circles, findFunc)
    },

    async lookupAttendee({state}, name) {
      if (!name || !state.gathering) return null
      const findFunc = arr => {
        let result = null
        arr.forEach(circle => {
          if (!result) {
            const found = circle.attendees.find(a => a.name === name)
            if (found) {
              result = found
            }
          }
        })
        return result
      }
      return H.recurseFindCircles(state.gathering.circles, findFunc)
    },

    async addCircle({state, commit}, payload) {
      const fullPath =
        state.gathering.id + state.currentCircle.parentPath + '/circles/'
      const newRef = db.ref(`gatherings/${fullPath}`).push()
      newRef.set(payload)
      payload.id = newRef.key
      commit('SET_CURRENT_CIRCLE', payload)
    },

    async addToAdmins({state}, name) {
      const adminsRef = db.ref(
        `gatherings/${state.gathering.id}/admins/${name}`
      )
      adminsRef.set(true)
    },

    async joinCircle({state, commit}) {
      const circlePath = state.gathering.id + state.currentCircle.parentPath
      const attendeeRef = db.ref(`gatherings/${circlePath}/attendees`).push()
      attendeeRef.set(state.user)
      const u = state.user
      u.id = attendeeRef.key
      commit('SET_USER', u)
    },

    async leaveCircle({state}) {
      const circlePath = state.gathering.id + state.currentCircle.parentPath
      const attendeeRef = db.ref(
        `gatherings/${circlePath}/attendees/${state.user.id}`
      )
      attendeeRef.remove()
    }
  },

  getters: {
    isAdmin: state => {
      if (!state.user || !state.currentCircle || !state.gathering.admins) {
        return false
      }
      return !!state.gathering.admins.find(a => a.name === state.user.name)
    },
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
              if (state.gathering.admins.find(name => name === attendee.name)) {
                node.children.push({
                  name: attendee.name,
                  value: 2
                })
              } else {
                node.children.push({
                  name: attendee.name,
                  value: 1
                })
              }
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
