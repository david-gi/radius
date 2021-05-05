<template>
  <BaseModal
    :modal-id="modalId"
    :no-close="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="userform" @submit.stop.prevent="handleSubmit">
      <h3>
        Security Checkpoint
      </h3>
      <b-form-group
        v-if="$store.state.showSecurity"
        label-for="password-input"
        class="pt-3 mr-1 text-white"
      >
        <b-form-input
          type="password"
          v-model="password"
          placeholder="What's the password?"
          autofocus
        />
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue'

export default {
  name: 'SecurityModal',
  components: {BaseModal},
  data() {
    return {
      modalId: 'security-modal',
      password: null
    }
  },
  methods: {
    resetModal() {
      this.password = null
    },

    async handleSubmit() {
      await this.$store.commit('SET_PASSWORD', this.password)
      await this.$store.dispatch(
        'fetchGathering',
        window.location.hash.substring(1)
      )
    }
  }
}
</script>
