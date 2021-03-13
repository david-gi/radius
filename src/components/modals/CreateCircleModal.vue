<template>
  <BaseModal
    :modal-id="modalId"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <h3>Start a Circle</h3>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        :invalid-feedback="nameFeedback"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model="circle.name"
          placeholder="Enter a name"
          :formatter="v => (v.length > 40 ? v.substring(0, 40) : v)"
          trim
          required
        />
      </b-form-group>
      <b-form-group label-for="allow-input">
        <b-form-checkbox
          v-model="circle.allowChildren"
          name="allow-input"
          button-variant="secondary"
          button
          :value="false"
          :unchecked-value="true"
        >
          <span v-if="circle.allowChildren">Participants can make circles</span>
          <span v-else>Only admins can make circles</span>
        </b-form-checkbox>
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import {Circle} from '../../models/index'
import BaseModal from './BaseModal.vue'

export default {
  name: 'Landing',
  components: {BaseModal},
  data() {
    return {
      modalId: 'create-circle-modal',
      circle: new Circle(),
      formState: null
    }
  },
  mounted() {},
  computed: {
    nameFeedback() {
      return this.circle && !this.circle.name
        ? 'Name is required'
        : 'Name is already taken'
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      const unique =
        (!this.$store.state.currentCircle ||
        !this.$store.state.currentCircle.circles) ||
        !this.$store.state.currentCircle.circles.find(
          c => c.name === this.circle.name
        )
      this.formState = valid && unique
      return valid && unique
    },
    resetModal() {
      this.circle = new Circle()
    },
    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$store.dispatch('addCircle', this.circle)

      this.$nextTick(() => {
        this.$bvModal.hide(this.modalId)
        this.$emit('updated')
      })
    }
  }
}
</script>
