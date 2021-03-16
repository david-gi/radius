<template>
  <BaseModal
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <h3 class="mt-n2">Join Gathering</h3>
      <div class="h5">
        <strong>{{ $store.state.gathering.name }}</strong>
        <i class="ml-1">{{ $store.state.gathering.description }}</i>
      </div>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        invalid-feedback="Name required"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model="user.name"
          placeholder="Enter your name"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          trim
          required
        />
      </b-form-group>
      <b-form-group label-for="avatar-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="avatar-input"
          type="url"
          v-model="user.avatar"
          placeholder="Avatar URL (optional)"
          :formatter="v => (v.length > 300 ? v.substring(0, 300) : v)"
          trim
        />
      </b-form-group>
      <b-form-group label-for="scratchpad-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="scratchpad-input"
          v-model="user.scratchpad"
          placeholder="Share your details (optional)"
          :formatter="v => (v.length > 500 ? v.substring(0, 500) : v)"
          trim
        />
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import {User} from '../../models/index'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CreateUserModal',
  components: {BaseModal},
  data() {
    return {
      modalId: 'create-user-modal',
      user: new User(),
      formState: null
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.formState = valid
      return valid
    },
    resetModal() {
      this.user = new User()
      this.formState = null
    },

    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$store.commit('SET_USER', this.clone(this.user))
      this.$bvModal.hide(this.modalId)
    }
  }
}
</script>
