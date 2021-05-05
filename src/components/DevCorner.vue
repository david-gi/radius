<template>
  <div v-cloak id="DevCorner" class="fixed-top p-3 mr-1">
    <div class="float-right">
      <img
        src="/contact.svg"
        title="Send Feedback"
        alt="Feedback"
        class="pointer hoverable flip-h mr-n2"
        height="40px"
        width="40px"
        @click="openFeebackModal"
      />
      <img
        src="/contribute.svg"
        title="Support this project"
        alt="Support this project"
        class="pointer hoverable"
        height="40px"
        width="40px"
        @click="openDonateModal"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevCorner',
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    openFeebackModal() {
      this.$bvModal.show('feedback-modal')
    },
    openDonateModal() {
      this.$bvModal.show('donate-modal')
    }
  }
}
</script>
<style scoped></style>
