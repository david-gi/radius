<template>
  <BaseModal
    :modal-id="modalId"
    :no-close="false"
    :ok-text="'Make a contribution'"
    @on-submit="handleSubmit"
  >
    <h3>
      Support <span class="text-info">circletalk</span> 🚀
    </h3>
    <b-form-group label-for="msg-input" class="pt-2 mr-1 text-white">
      <br />
      <h5>This project is free to all <small>(except the developer) 😓</small></h5>
      <br />
      <p>
        Keep this project alive, help out with server fees or just show your
        appreciation, contribute below.
      </p>
      <br />
      <small class="float-right">⚠ This will exit your gathering!</small>
      <form
        ref="donateForm"
        action="https://www.paypal.com/donate"
        method="post"
        target="_top"
        class="float-right p-0 m-0 pt-1 pr-2 hoverable"
        @submit.prevent="handleSubmit"
      >
        <input type="hidden" name="hosted_button_id" value="NTGZVPYZWDMKQ" />
      </form>
    </b-form-group>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue'

export default {
  name: 'DonateModal',
  components: {BaseModal},
  data() {
    return {
      modalId: 'donate-modal',
      feedbackMsg: null
    }
  },
  mounted() {},
  methods: {
    handleSubmit() {
      this.refs.donateForm.submit()
    }
  }
}
</script>
