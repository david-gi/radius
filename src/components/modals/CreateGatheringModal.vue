<template>
  <BaseModal
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <h3 class="mt-n2">
        Start a Gathering
      </h3>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        invalid-feedback="Name is required"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model="gathering.name"
          placeholder="Enter a name"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          trim
          required
        />
      </b-form-group>
      <b-form-group label-for="description-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="description-input"
          v-model="gathering.description"
          placeholder="Enter a description (optional)"
          :formatter="v => (v.length > 120 ? v.substring(0, 120) : v)"
          trim
        />
      </b-form-group>
      <b-form-group label-for="password-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="password-input"
          v-model="gathering.password"
          placeholder="Enter a password (optional)"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          trim
        />
      </b-form-group>
      <b-form-group label-for="size-input" class="pt-2 mr-1 text-white">
        <span>Max attendees: {{gathering.size}}</span>
        <b-form-input
          id="size-input"
          type="range"
          v-model="gathering.size"
          min="2"
          max="50"
        />
      </b-form-group>
      <b-form-group label-for="circles-input" class="pt-2 mr-1 text-white">
        <b-form-tags
          placeholder="List starter circle names..."
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
      const valid = this.$refs.form.checkValidity()
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
      this.gathering.admins = [this.$store.state.user]
      await this.$store
        .dispatch('createGathering', this.clone(this.gathering))
        .then(() => {
          this.$bvModal.hide(this.modalId)
        })
    }
  }
}
</script>
