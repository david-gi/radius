<template>
  <div v-cloak id="FeedbackCorner" class="fixed-top p-3 pr-5 mr-5">
    <div class="float-right">
      <form
        ref="donateForm"
        action="https://www.paypal.com/donate"
        method="post"
        target="_top"
        class="float-right p-0 m-0 pt-1 pr-2"
        @submit.prevent="handleSubmit"
      >
        <input type="hidden" name="hosted_button_id" value="NTGZVPYZWDMKQ" />
        <input
          type="image"
          src="/rainy.svg"
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
  name: 'FeedbackCorner',
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    handleSubmit(e) {
      confirm('⚠ This will exit your current gathering!')
      this.refs.donateForm.submit()
    }
  }
}
</script>
<style scoped></style>
