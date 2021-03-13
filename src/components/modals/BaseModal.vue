<template>
  <b-modal
    :id="modalId"
    hide-header
    header-bg-variant="primary"
    footer-bg-variant="primary"
    ok-variant="info"
    cancel-variant=" text-white"
    cancel-title="cancel"
    body-bg-variant="primary"
    body-text-variant="white"
    content-class="p-2 bg-info"
    footer-class="border-0 pt-0 mt-0"
    centered
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <slot />
  </b-modal>
</template>

<script>
export default {
  name: 'BaseModal',
  props: { modalId: String},
  methods: {
    resetModal() {
      this.$emit('on-reset')
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      this.$emit('on-submit')
    }
  }
}
</script>
