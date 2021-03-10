export default {
  basicMutations: props => {
    // create mutation functions
    const mutations = {}
    props.forEach(p => {
      const fName = 'SET_' +
        p
          .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
          .join('_')
          .toUpperCase()
      mutations[fName] = (state, val) => {
        state[p] = val
      }
      // easily accessible mutations
      this[p] = (commit, val) => {
        commit(fName, val)
      }
    })
  }
}
