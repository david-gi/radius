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
  }
}
