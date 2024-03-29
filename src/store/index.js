import Vue from 'vue'
import Vuex from 'vuex'
import {Gathering} from '../models/index'
import H from './storeHelpers'
import firebase from 'firebase'
import fbaseConfig from '../../fbaseConfig.js'

Vue.use(Vuex)

//firebase init
const fbase = firebase.initializeApp(fbaseConfig)
const db = fbase.database()
const cFunc = fbase.functions()
const storage = fbase.storage()

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
      }, payload.time || 2500)
      commit('SET_TIMER', timerRef)
    },

    async fetchGathering({commit, state, dispatch}, id) {
      commit('SET_LOADING', true)

      const checkSecurity = cFunc.httpsCallable('checkSecurity')
      const valid = await checkSecurity({id, password: state.password})
      if (!valid.data) {
        dispatch('displayMessage', {
          msg: 'Please enter the correct password.',
          time: 6000
        })
        commit('SET_SHOW_SECURITY', true)
        return
      }
      commit('SET_SHOW_SECURITY', false)

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
          val.description,
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
        setTimeout(() => {
          commit('SET_LOADING', false)
        }, 800)
        gatheringRef.on('value', handler)
      })
    },

    async createGathering({commit}, payload) {
      try {
        commit('SET_LOADING', true)

        const newRef = db.ref('gatherings').push()
        const id = newRef.key
        const hasPass = payload.password && payload.password.length > 0
        const gathering = {
          name: payload.name,
          description: payload.description || '',
          maxSize: payload.maxSize,
          password: Boolean(hasPass)
        }
        if (hasPass) {
          await db.ref(`security/${id}`).set(payload.password)
          commit('SET_PASSWORD', payload.password)
        }
        await newRef.set(gathering)

        H.log(payload.circles.length)
        for (var i = 0; i < payload.circles.length; i++) {
          const newCirclesRef = db.ref(`gatherings/${id}/circles`).push()
          // eslint-disable-next-line no-unused-vars
          const cId = await newCirclesRef.set(payload.circles[i])
          H.log(newCirclesRef.Id)
        }
        setTimeout(() => {
          commit('SET_ROUTE', id)
        }, 5000)
      } catch (ex) {
        commit('SET_LOADING', false)
        console.error(ex)
        this.dispatch('displayMessage', {
          msg: 'Sorry, there was an issue, please try again.'
        })
      }
    },

    async joinGathering({state, commit}) {
      try {
        commit('SET_LOADING', true)

        await db
          .ref(`gatherings/${state.gathering.id}/users/${state.user.name}`)
          .set({
            user: state.user.name
          })
      } catch (ex) {
        commit('SET_LOADING', false)
        console.error(ex)
        this.dispatch('displayMessage', {
          msg: 'Sorry, there was an issue, please try again.'
        })
      }
    },

    async leaveGathering({commit, state}) {
      commit('SET_LOADING', true)

      if (state.user) {
        const ref = db.ref(
          `gatherings/${state.gathering.id}/users/${state.user.name}`
        )
        if (ref) await ref.remove()
        commit('SET_USER', null)
        commit('SET_GATHERING', null)
        commit('SET_PASSWORD', null)
        commit('SET_CURRENT_CIRCLE', null)
      }

      commit('SET_LOADING', false)
    },

    async addCircle({state, commit}, payload) {
      commit('SET_LOADING', true)

      try {
        const fullPath =
          state.gathering.id +
          (state.currentCircle.parentPath || '') +
          '/circles/'
        const newRef = db.ref(`gatherings/${fullPath}`).push()

        await newRef.set(payload)
        payload.id = newRef.key
        payload.password = state.password
        payload.parentPath =
          (state.currentCircle.parentPath || '') + '/circles/' + payload.id
      } catch {
        commit('SET_LOADING', false)
      }
    },

    async joinCircle({state, commit, dispatch}, circle) {
      try {
        dispatch('leaveCurrentCircle')
        commit('SET_LOADING', true)
        try {
          if (state.user.img) {
            const ref = storage.ref(
              `${state.gathering.id}/${state.user.name}.jpg`
            )
            try {
              state.user.img = await ref.getDownloadURL()
            } catch (e) {
              console.log(e)
            }
            await ref.putString(state.user.img, 'data_url')
            state.user.img = await ref.getDownloadURL()
          }
        } catch (e) {
          console.error(e)
        }

        const circlePath = state.gathering.id + circle.parentPath
        await db
          .ref(`gatherings/${circlePath}/attendees/${state.user.name}`)
          .set({
            ...state.user,
            user: state.user.name,
            password: state.password
          })
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
    },

    async sendFeedback({state}, message) {
      if (!message || !state.user) return
      const newRef = db.ref(`feedback`).push()
      await newRef.set({
        message,
        gathering: state.gathering.name,
        user: state.user.name,
        date: new Date().toUTCString()
      })
      this.dispatch('displayMessage', {
        msg: 'Thanks for the feedback.'
      })
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
