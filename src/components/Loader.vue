<template>
  <b-button v-if="loading" variant="dark" disabled class="p-2">
    <b-spinner></b-spinner>
    <span class="sr-only">Loading...</span>
  </b-button>
</template>

<script>
export default {
  name: 'Loader',
  computed: {
    loading() {
      return this.$store.state.loading
    }
  }
}
</script>
