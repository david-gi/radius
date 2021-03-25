<template>
  <input id="clipboard-input" type="text" />
</template>

<script>
export default {
  name: 'CopyToClip',
  methods: {
    copyToClip(t) {
      const inp = document.getElementById('clipboard-input')
      inp.value = t
      inp.select()
      inp.setSelectionRange(0, 99999)
      document.execCommand('copy')
    },
  }
}
</script>
