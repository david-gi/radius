<template>
  <div v-cloak id="DevCorner" class="fixed-top p-3 mr-1">
    <div class="float-right">
      <img
        src="/rainy.svg"
        title="Got issues?"
        alt="Feedback"
        class="pointer hoverable"
        @click="openFeebackModal"
      />
      <form
        ref="donateForm"
        action="https://www.paypal.com/donate"
        method="post"
        target="_top"
        class="float-right p-0 m-0 pt-1 pr-2 hoverable"
        @submit.prevent="handleDonateSubmit"
      >
        <input type="hidden" name="hosted_button_id" value="NTGZVPYZWDMKQ" />
        <input
          type="image"
          src="/bmac.svg"
          border="0"
          name="submit"
          title="Support the developer and help out with server fees"
          alt="Support the developer and help out with server fees"
        />
      </form>
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
    handleDonateSubmit() {
      confirm(
        'Your support is very much welcomed and appreciated! ☺ \n\n⚠ This will exit your current gathering and redirect you to PayPal.'
      )
      this.refs.donateForm.submit()
    }
  }
}
</script>
<style scoped></style>
