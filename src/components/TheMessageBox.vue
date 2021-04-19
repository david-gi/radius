<template>
  <b-alert
    v-show="msgText"
    show
    variant="secondary"
    fade
    class="position-fixed fixed-bottom m-0 rounded-0 text-center"
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
