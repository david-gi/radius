<template>
  <BaseModal
    :modal-id="modalId"
    :no-close="false"
    :ok-text="'Send'"
    @on-submit="handleSubmit"
  >
    <form ref="feedbackform" @submit.stop.prevent="handleSubmit">
      <h3>
        Send Feedback 📢
      </h3>
      <br />
      <h5>Send the developer feedback <small>or just get in touch.</small></h5>
      <b-form-group label-for="msg-input" class="pt-2 mr-1 text-white">
        <b-form-textarea
          id="msg-input"
          v-model="feedbackMsg"
          placeholder="Got bugs, issues, comments or questions?"
          trim
          required
          autofocus
        />
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue'

export default {
  name: 'FeedbackModal',
  components: {BaseModal},
  data() {
    return {
      modalId: 'feedback-modal',
      feedbackMsg: null
    }
  },
  mounted() {},
  methods: {
    async handleSubmit() {
      if (!this.feedbackMsg || this.feedbackMsg.length < 9) {
        return
      }

      await this.$store.dispatch('sendFeedback', this.feedbackMsg)

      this.$nextTick(() => {
        this.$bvModal.hide(this.modalId)
        this.$emit('updated')
        this.feedbackMsg = null
      })
    }
  }
}
</script>
