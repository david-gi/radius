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
    modal-class="my-5 py-5"
    content-class="bg-primary shadow-lg p-2"
    footer-class="border-0 mt-0 pr-4 pb-4 pt-0"
    :hide-footer="noFooter"
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
  props: {
    modalId: {type: String, required: true},
    noClose: {type: Boolean, default: false},
    noFooter: {type: Boolean, default: false}
  },
  methods: {
    resetModal() {
      this.$emit('on-reset')
    },
    handleOk(bvModalEvt) {
      this.$store.dispatch('displayMessage', null)
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
