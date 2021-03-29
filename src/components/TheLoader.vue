<template>
  <div class="faded">
    <b-progress
      v-if="loading"
      value="100"
      variant="info"
      class="internal-pan fixed-top faded"
    ></b-progress>
  </div>
</template>

<script>
export default {
  name: 'TheLoader',
  computed: {
    loading() {
      return this.$store.state.loading
    }
  }
}
</script>
<style>
.internal-pan {
  max-height: 4px;
  animation: pan 1.5s alternate-reverse infinite;
}
@keyframes pan {
  0% {
    padding-left: 0;
    padding-right: 0;
  }
  100% {
    padding-left: 45%;
    padding-right: 45%;
  }
}
</style>
