import Vue from 'vue'
import Vuex from 'vuex'
import {User, Gathering, Circle} from '../models/index'
import H from './storeHelpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: true,
    user: new User(
      'Derek',
      "I'm not human anymore",
      'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.strawberrytongue.com%2Fwp-content%2Fuploads%2F2014%2F03%2FSleep%2BParty%2BPeople%2B%2Bpress%2Bpic2.jpg&f=1&nofb=1'
    ),
    gathering: null,
    currentCircle: null
  },

  // auto-generate basic mutations
  mutations: {
    ...H.basicMutations(['loading', 'user', 'gathering', 'currentCircle'])
  },

  actions: {
    async fetchGathering({commit}, id) {
      const res = await new Promise(r => {
        const gathering = new Gathering(
          'The Party',
          'A party!',
          //'https://wallpaperaccess.com/full/274198.jpg',
          'https://png.pngtree.com/thumb_back/fw800/back_our/20190621/ourmid/pngtree-taobao-promotion-creative-banner-poster-background-image_181003.jpg',
          25,
          null
        )
        gathering.id = id
        const parentCircle = new Circle('Meet and Greet', false)
        const userA = new User(
          'Derek',
          "I'm not human anymore",
          'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.strawberrytongue.com%2Fwp-content%2Fuploads%2F2014%2F03%2FSleep%2BParty%2BPeople%2B%2Bpress%2Bpic2.jpg&f=1&nofb=1'
        )
        commit('SET_USER', userA)
        gathering.admins = [userA]
        parentCircle.participants = [
          userA,
          new User(
            'Sara',
            "I'm not human either",
            'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.strawberrytongue.com%2Fwp-content%2Fuploads%2F2014%2F03%2FSleep%2BParty%2BPeople%2B%2Bpress%2Bpic2.jpg&f=1&nofb=1'
          )
        ]
        const nestedCircle = new Circle('Philosophy')
        nestedCircle.participants = [
          new User(
            'Leah',
            "I'm not human at all",
            'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.strawberrytongue.com%2Fwp-content%2Fuploads%2F2014%2F03%2FSleep%2BParty%2BPeople%2B%2Bpress%2Bpic2.jpg&f=1&nofb=1'
          )
        ]
        parentCircle.circles = [nestedCircle]
        gathering.circles = [
          parentCircle,
          new Circle('Discussion'),
          new Circle('Questions', false)
        ]
        r(gathering)
      }) // firebase call
      commit('SET_GATHERING', res)
    },

    async createGathering({commit}, payload) {
      const res = await new Promise(r => r(payload)) // firebase call
      commit('SET_GATHERING', res)
    },

    lookupCircle({state}, name) {
      if (!name || !state.gathering) {
        return null
      }
      // local recursive function
      function findCircle(circles) {
        let foundCircle = circles.find(circle => circle.name === name)
        if (foundCircle) {
          return foundCircle
        } else {
          return circles.find(circle => {
            if (circle.circles) {
              return findCircle(circle.circles)
            }
          })
        }
      }
      return findCircle(state.gathering.circles)
    },

    async addCircle({state, commit, dispatch}, payload) {
      await new Promise(r => r(payload)) // firebase call
      //dispatch('fetchGathering', state.gathering.id)

      // Testing, remove
      const gathering = state.gathering

      // local recursive function
      function addNewCircle(circles) {
        return circles.map(circle => {
          if (state.currentCircle && circle.name === state.currentCircle.name) {
            if (!circle.circles) {
              circle.circles = []
            }
            circle.circles.push(payload)
          } else if (circle.circles && circle.circles.length) {
            circle.circles = addNewCircle(circle.circles)
          }
          return circle
        })
      }
      if (!state.currentCircle) {
        gathering.circles.push(payload)
      } else {
        gathering.circles = addNewCircle(state.gathering.circles)
      }

      commit('SET_GATHERING', gathering)
      commit('SET_CURRENT_CIRCLE', payload)
    },

    async addToAdmins({state, dispatch}, payload) {
      await new Promise(r => r(payload)) // firebase call
      dispatch('fetchGathering', state.gathering.id)
    },

    async joinCircle({state}) {
      await new Promise(r => r(state.currentRoom.id, state.user.id)) // firebase call
    },

    async leaveCircle({state}) {
      await new Promise(r => r(state.currentRoom.id, state.user.id)) // firebase call
    },

    async removeCircle({state, dispatch}, id) {
      await new Promise(r => r(id)) // firebase call
      dispatch('fetchGathering', state.gathering.id)
    }
  },

  getters: {
    isAdmin: state => {
      if (!state.user || !state.currentCircle) return false
      return !!state.gathering.admins.find(a => a.id === state.user.id)
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
      if (!state.gathering) return {}
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
          circle.participants.forEach(participant => {
            if (this.gathering.admins.find(a => a.name === participant.name)) {
              node.children.push({
                name: participant.name,
                value: 2
              })
            } else {
              node.children.push({
                name: participant.name,
                value: 1
              })
            }
          })
          return node
        })
      }

      nodes.children = addChildrenNodes(state.gathering.circles)
      return nodes
    }
  }
})
