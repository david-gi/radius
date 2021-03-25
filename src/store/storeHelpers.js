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
    function recurse(_circles, path) {
      const isObj = typeof _circles === 'object'
      const _circleArr = isObj ? Object.values(_circles) : _circles
      let results = _circleArr.map((c, i) => {
        const id = isObj ? Object.keys(_circles)[i] : c.id
        return {
          id,
          parentPath: path + `/circles/${id}`,
          ...c
        }
      })
      return results.map(c => {
        const nested = c
        if (nested.attendees) {
          nested.attendees = Object.values(c.attendees).map((a, i) => {
            return {
              name: Object.keys(c.attendees)[i],
              ...Object.values(c.attendees)[i]
            }
          })
        }
        if (nested.circles) {
          nested.circles = recurse(c.circles, c.parentPath)
        }
        return nested
      })
    }
    return recurse(circles, '')
  },

  recurseFindCircles: (circles, findFunc) => {
    function recurse(_circles, _findFunc, path) {
      let result = _findFunc(_circles)
      if (result) {
        // result.parentPath = path + `/circles/${result.id}`
        return result
      } else {
        result = null
        _circles.forEach(circle => {
          if (circle.circles) {
            path += `/circles/${circle.id}`
            const nested = recurse(circle.circles, _findFunc, path)
            if (nested) {
              result = nested
            }
          }
        })
        return result
      }
    }
    return recurse(circles, findFunc, '')
  }
}
