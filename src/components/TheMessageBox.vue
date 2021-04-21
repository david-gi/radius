<template>
  <div
    v-show="msgText"
    class="fixed-bottom m-0 p-2 text-center bg-warning text-black faded"
    :class="{'mb-5': inGathering}"
    style="z-index:3000"
  >
    <strong>{{ msgText }}</strong>
  </div>
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
    },
    inGathering() {
      return this.$store.state.gathering && this.$store.state.user
    }
  }
}
</script>
<style scoped></style>
