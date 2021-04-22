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
      @keyup.enter.exact.prevent="handleSubmit"
    >
      <div class="h2 bg-secondary rounded mx-n5 mt-n2 mb-4 px-5 py-4 shadow-md">
        <div>
          <small class="font-weight-bold">Join:</small><br />
          <strong class="d-inline-block w-100 mb-n2 text-success text-truncate">
            <span class="d-none d-sm-inline">
              {{ $store.state.gathering.name }}
            </span>
            <small class="d-inline d-sm-none h5 font-weight-bold">
              {{ $store.state.gathering.name }}
            </small>
          </strong>
          <p class="h5 mt-2 ">
            <small>{{ $store.state.gathering.description }} <Intro /></small>
          </p>
        </div>
      </div>

      <div
        class="p-3 mt-n1 mb-4 mr-1 bg-dark faded rounded"
        v-b-tooltip.click.v-info
        title="Copied!"
        @click="copyToClip(`circletalk.ca/#${$store.state.gathering.id}`)"
      >
        <strong class="h5">Gathering Link:</strong>
        <small class="float-right">copy</small>
        <br />
        <span class="text-info">
          circletalk.ca/#{{ $store.state.gathering.id }}
        </span>
      </div>

      <h4 class="mt-n2">
        Your Name Tag
      </h4>
      <b-form-group label-for="img-input" class="pt-2 mr-1">
        <UserSnapshot v-model="user.img" />
      </b-form-group>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        :invalid-feedback="nameFeedback"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model.trim.lazy="user.name"
          placeholder="Nickname"
          :formatter="v => (v.length > 23 ? v.substring(0, 23) : v)"
          required
          @keypress="this.formatIdInput"
          @keyup="() => (formState = $refs.userform.checkValidity())"
        />
      </b-form-group>
      <b-form-group label-for="scratchpad-input" class="pt-2 mr-1 text-white">
        <b-form-textarea
          id="scratchpad-input"
          v-model="user.scratchpad"
          placeholder="Extra info"
          :formatter="v => (v.length > 500 ? v.substring(0, 500) : v)"
        />
      </b-form-group>

      <b-link class="text-white text-nowrap faded d-block pl-3 pb-2" href="/">
        Or start a new gathering
        <b-icon-arrow-right-short scale="1.5" />
      </b-link>
    </form>
  </BaseModal>
</template>

<script>
import {User} from '../../models/index'
import BaseModal from './BaseModal.vue'
import Intro from '../Intro.vue'
import UserSnapshot from '../controls/UserSnapshot'

export default {
  name: 'CreateUserModal',
  components: {BaseModal, Intro, UserSnapshot},
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

      await this.$store.commit('SET_USER', this.clone(this.user))
      await this.$store.dispatch('joinGathering')
    }
  }
}
</script>
