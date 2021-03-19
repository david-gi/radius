<template>
  <b-alert
    v-show="msg"
    show
    variant="secondary"
    fade
    class="position-fixed fixed-bottom m-0 rounded-0 text-center"
    style="z-index: 2000;"
  >
    {{ msg }}
  </b-alert>
</template>

<script>
export default {
  name: 'MessageBox',
  data() {
    return {}
  },
  computed: {
    msg() {
      return this.$store.state.message
    }
  }
}
</script>
<style scoped></style>
