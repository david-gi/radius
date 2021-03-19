import {_} from 'core-js'

export default {
  log: x => console.error('>>>' + JSON.stringify(x)),

  basicMutations: props => {
    // create mutation functions
    let mutations = {}
    props.forEach(p => {
      const fName =
        'SET_' +
        p
          .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
          .join('_')
          .toUpperCase()

      mutations[fName] = (state, val) => {
        state[p] = val
      }
    })
    return mutations
  },

  arrayizeCircles: circles => {
    function recurse(_circles) {
      const _circleArr = Object.values(_circles)
      let results = _circleArr.map((c, i) => {
        return {
          id: Object.keys(_circles)[i],
          ...c
        }
      })
      return results.map(c => {
        const nested = c
        if (nested.attendees) {
          nested.attendees = Object.values(c.attendees)
        }
        if (nested.circles) {
          nested.circles = recurse(c.circles)
        }
        return nested
      })
    }
    return recurse(circles)
  },

  recurseFindCircles: (circles, findFunc) => {
    function recurse(_circles, _findFunc, path) {
      let result = _findFunc(_circles)
      if (result) {
        result.path = path + `/circles/${result.id}`
        return result
      } else {
        result = null
        _circles.forEach(circle => {
          if (circle.circles) {
            path += `/circles/${circle.id}`
            const nested = recurse(circle.circles, _findFunc, path)
            if (nested) {
              result = nested
              result.path = path
            }
          }
        })
        return result
      }
    }
    return recurse(circles, findFunc, '')
  }
}
