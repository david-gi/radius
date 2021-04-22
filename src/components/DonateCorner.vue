<template>
  <div v-cloak id="DonateCorner" class="fixed-top p-3 mr-1">
    <div class="float-right">
      <form
        action="https://www.paypal.com/donate"
        method="post"
        target="_top"
        class="float-right p-0 m-0 pt-1 pr-2"
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
  name: 'DonateCorner',
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {}
}
</script>
<style scoped></style>
