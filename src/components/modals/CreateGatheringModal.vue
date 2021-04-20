<template>
  <BaseModal
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="gatheringform" @submit.stop.prevent="handleSubmit">
      <div class="mt-n3 mb-4">
        <h1 class="h3 m-0 mb-n1 text-info d-inline-block">circletalk</h1>
        <div>gather • mingle • connect</div>
      </div>
      <div class="h2 bg-secondary rounded mx-n5 mt-n2 mb-4 px-5 py-4 shadow-md">
        <strong>Start a Gathering</strong>
      </div>
      <div class="h5 mt-n2">
        Gathering details
      </div>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        invalid-feedback="Title is required"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model.lazy.trim="gathering.name"
          placeholder="Title"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          required
          autofocus
          @keypress="this.formatIdInput"
        />
      </b-form-group>
      <b-form-group label-for="description-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="description-input"
          v-model="gathering.description"
          placeholder="Tagline (optional)"
          :formatter="v => (v.length > 300 ? v.substring(0, 300) : v)"
        />
      </b-form-group>
      <b-form-group label-for="password-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="password-input"
          v-model.lazy.trim="gathering.password"
          placeholder="Password (optional)"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
        />
      </b-form-group>
      <b-form-group
        v-if="false"
        label-for="maxsize-input"
        class="pt-2 mr-1 text-white"
      >
        <span>Max attendees: {{ gathering.maxSize }}</span>
        <b-form-input
          id="maxsize-input"
          type="range"
          v-model="gathering.maxSize"
          min="2"
          max="100"
        />
      </b-form-group>
      <div class="h5 mb-2">Setup initial circles</div>
      <b-form-group label-for="circles-input" class="pt-2 mr-1 text-white">
        <b-form-tags
          placeholder="Add a circle..."
          input-id="circles-input"
          v-model="circles"
          tag-class="bg-primary"
          input-class="bg-white"
          add-button-variant="primary"
        />
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import {Circle, Gathering} from '../../models/index'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CreateGatheringModal',
  components: {BaseModal},
  data() {
    return {
      modalId: 'create-gathering-modal',
      gathering: new Gathering(),
      circles: ['Main', 'Info'],
      formState: null
    }
  },
  circles() {
    this.convertCircleTags()
    this.$store.commit('SET_GATHERING', this.clone(this.gathering))
  },
  methods: {
    convertCircleTags() {
      this.gathering.circles = []
      this.circles.forEach(tag => {
        const tagCircle = new Circle(tag, false)
        this.gathering.circles.push(tagCircle)
      })
    },
    checkFormValidity() {
      const valid = this.$refs.gatheringform.checkValidity()
      this.formState = valid
      return valid
    },
    resetModal() {
      this.gathering = new Gathering()
      this.circles = ['Main', 'Info']
      this.formState = null
    },

    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }

      this.convertCircleTags()
      await this.$store
        .dispatch('createGathering', this.clone(this.gathering))
        .then(() => {
          this.$bvModal.hide(this.modalId)
        })
    }
  }
}
</script>
