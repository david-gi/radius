<template>
  <b-alert
    v-show="msgText"
    show
    variant=" "
    fade
    class="position-fixed fixed-bottom m-0 rounded-0 text-center bg-dark text-info"
    style="z-index: 1000;"
  >
    {{ msgText }}
  </b-alert>
</template>

<script>
export default {
  name: 'TheMessageBox',
  data() {
    return {}
  },
  computed: {
    msgText() {
      return this.$store.state.message
    }
  }
}
</script>
<style scoped></style>
