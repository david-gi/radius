import Vue from 'vue'
import Vuex from 'vuex'
import H from './store/storeHelpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    gathering: null,
    currentCircle: null
  },

  mutations: {
    ...H.basicMutations(Object.keys(this.state))
  },

  actions: {
    async fetchGathering({commit}, id) {
      const res = await new Promise(r => r(id)) // firebase call
      H.gathering(commit, res)
    },

    async createGathering({commit}, payload) {
      const res = await new Promise(r => r(payload)) // firebase call
      H.gathering(commit, res)
    },

    async addCircle({state, commit}, payload) {
      await new Promise(r => r(payload)) // firebase call
      const res = state.gathering.circles.push(payload)
      H.gathering(commit, res)
    },

    async addToAdmins({state, commit}, id) {
      await new Promise(r => r(id)) // firebase call
      const res = state.currentRoom.admins.push(id)
      H.gathering(commit, res)
    },

    async joinCircle({state}) {
      await new Promise(r => r(state.currentRoom.id, state.user.id)) // firebase call
    },

    async leaveCircle({state}) {
      await new Promise(r => r(state.currentRoom.id, state.user.id)) // firebase call
    },

    async removeCircle({state, commit}, id) {
      await new Promise(r => r(id)) // firebase call
      const res = state.gathering
      res.circles = res.circles.filter(c => c.id != id)
      H.gathering(commit, res)
    }
  },

  getters: {
    isAdmin: state => {
      return state.user.currentCircle.admins.find(a => a.id === state.user.id)
    },
    gatheringNodes: state => {
      const nodes = {name: state.gathering.name}

      // local recursive function
      function addChildrenNodes(circles) {
        return circles.map(circle => {
          const node = {
            name: circle.name,
            value: 3,
            children: circle.circles ? [] : null
          }
          circle.admins.forEach(admin => {
            node.children.push({
              name: admin.id,
              value: 2
            })
          })
          circle.participants.forEach(participant => {
            node.children.push({
              name: participant.id,
              value: 2
            })
          })
          if (circle.circles) {
            node.children = this(circle.circles)
          }
          return node
        })
      }

      nodes.children = addChildrenNodes(state.gathering.circles)
      return nodes
    }
  }
})
