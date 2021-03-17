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

  recurseCircles: (circles, findFunc) => {
    function recurse(_circles, _findFunc) {
      let result = _findFunc(_circles)
      if (result) {
        return result
      } else {
        result = null
        _circles.forEach(circle => {
          if (circle.circles) {
            const nested = recurse(circle.circles, _findFunc)
            if (nested) {
              result = nested
            }
          }
        })
        return result
      }
    }
    return recurse(circles, findFunc)
  }
}
