export default {
  methods: {
    j: obj => {
      const os = JSON.stringify(obj) + "  <<<"
      console.error(os)
      alert(os)
    },
    clone: obj => {
      const clone = JSON.parse(JSON.stringify(obj))
      return clone
    }
  }
}
