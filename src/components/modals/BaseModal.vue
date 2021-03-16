<template>
  <b-modal
    :id="modalId"
    hide-header
    header-bg-variant="primary"
    footer-bg-variant="primary"
    ok-variant="info"
    cancel-variant=" text-white mr-3"
    body-bg-variant="primary"
    body-text-variant="white"
    body-class="px-4 pt-4 pb-0"
    content-class="bg-primary shadow-lg p-2"
    footer-class="border-0 mt-0 pr-4 pb-4 pt-0"
    centered
    :visible="noClose"
    :ok-title="noClose ? 'Ready to go!' : 'Add'"
    :cancel-title="noClose ? '' : 'cancel'"
    :cancel-disabled="noClose"
    :no-close-on-esc="noClose"
    :no-close-on-backdrop="noClose"
    :hide-backdrop="noClose"
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
  props: { modalId: String, noClose: Boolean},
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
