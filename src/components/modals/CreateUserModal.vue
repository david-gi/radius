<template>
  <BaseModal
    v-if="!$store.state.loading"
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form
      ref="userform"
      @submit.stop.prevent="handleSubmit"
      @keyup.enter="handleSubmit"
    >
      <div class="h2 bg-secondary rounded mx-n5 mt-n2 mb-4 px-5 py-4 shadow-md">
        <strong v-if="!$store.state.gathering">Start a Gathering</strong>
        <div v-else>
          <strong
            >Join:
            <span class="text-success">{{
              $store.state.gathering.name
            }}</span></strong
          >
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
          v-model.trim.lazy="user.name"
          placeholder="Enter your name"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          required
          autofocus
          @keyup="() => (formState = $refs.userform.checkValidity())"
        />
      </b-form-group>
      <b-form-group label-for="img-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="img-input"
          type="url"
          v-model="user.img"
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
        this.$store.state.gathering &&
        this.$store.state.gathering.users &&
        this.$store.state.gathering.users.find(n => n === this.user.name)
      this.formState = valid && !existing
      return valid && !existing
    },

    resetModal() {
      this.user = new User()
      this.formState = null
    },

    async handleSubmit() {
      const formValid = await this.checkFormValidity()
      if (!formValid) return

      this.$store.commit('SET_USER', this.clone(this.user))
      if (this.$store.state.gathering) {
        setTimeout(() => {
          this.$store.dispatch('joinGathering')
        }, 600)
      }
    }
  }
}
</script>
