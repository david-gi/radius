<template>
  <BaseModal
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="userform" @submit.stop.prevent="handleSubmit">
      <div class="h2 bg-secondary rounded mx-n5 mt-n2 mb-4 px-5 py-4 shadow-md">
        <strong v-if="!$store.state.gathering">Start a Gathering</strong>
        <div v-else>
          <strong>Join {{ $store.state.gathering.name }}</strong>
          <p class="h5 lh-sm mt-2 ">
            <small>{{ $store.state.gathering.description }}</small>
          </p>
        </div>
      </div>
      <h3 class="mt-n2">
        Fill out your Name Tag
      </h3>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        :invalid-feedback="nameFeedback"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model="user.name"
          placeholder="Enter your name"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          trim
          required
          autofocus
          @keyup="() => (formState = $refs.userform.checkValidity())"
        />
      </b-form-group>
      <b-form-group label-for="avatar-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="avatar-input"
          type="url"
          v-model="user.avatar"
          placeholder="Picture link (optional)"
          :formatter="v => (v.length > 300 ? v.substring(0, 300) : v)"
          trim
        />
      </b-form-group>
      <b-form-group label-for="scratchpad-input" class="pt-2 mr-1 text-white">
        <b-form-textarea
          id="scratchpad-input"
          v-model="user.scratchpad"
          placeholder="Share your details (optional)"
          :formatter="v => (v.length > 500 ? v.substring(0, 500) : v)"
          trim
        />
      </b-form-group>
      <b-form-group
        v-if="$store.state.gathering"
        label-for="password-input"
        class="pt-2 mr-1 text-white"
      >
        <b-form-input
          type="password"
          v-model="password"
          placeholder="Enter gathering password"
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
      formState: null,
      password: null
    }
  },
  computed: {
    nameFeedback() {
      return this.user && this.user.name
        ? 'Name already taken'
        : 'Name required'
    }
  },
  methods: {
    async checkFormValidity() {
      const valid = this.$refs.userform.checkValidity()
      const existing =
        this.user &&
        this.$store.gathering &&
        (await this.$store.dispatch('lookupAttendee', this.user.name))
      this.formState = valid && !existing
      return valid && !existing
    },
    async validatePassword() {
      return this.$store.dispatch('checkPassword', this.password)
    },
    resetModal() {
      this.user = new User()
      this.formState = null
    },

    async handleSubmit() {
      const fromValid = !(await this.checkFormValidity())
      const passValid = await this.validatePassword()
      if (fromValid || passValid) {
        return
      }

      await this.$store.commit('SET_USER', this.clone(this.user))
      this.$nextTick(() => {
        this.$bvModal.hide(this.modalId)
      })
    }
  }
}
</script>
