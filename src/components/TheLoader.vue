<template>
  <div class="faded">
    <b-button v-if="loading" variant="info" disabled class="p-2 mr-1 shadow">
      <b-spinner></b-spinner>
      <span class="sr-only">Loading...</span>
    </b-button>
    <b-progress v-if="loading" value="100" variant="info" striped class="fixed-bottom faded mb-n2"></b-progress>
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
