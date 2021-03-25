export default {
  methods: {
    j: obj => {
      const os = JSON.stringify(obj) + '  <<<'
      console.error(os)
      alert(os)
    },
    clone: obj => {
      const clone = JSON.parse(JSON.stringify(obj))
      return clone
    },
    copyToClip(t) {
      const inp = document.getElementById('clipboard-input')
      inp.value = t
      inp.select()
      inp.setSelectionRange(0, 99999)
      document.execCommand('copy')
      setTimeout(() => {
        this.$root.$emit('bv::hide::tooltip')
      }, 1000)
    },
    msg(m) {
      this.$store.dispatch('displayMessage', {msg: m})
    },
    loadOn() {
      this.$store.commit('SET_LOADING', true)
    },
    loadOff() {
      this.$store.commit('SET_LOADING', false)
    }
  }
}
