<template>
  <BaseModal v-if="false"
    :modal-id="modalId"
    :noClose="false"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <h3 class="mt-n2">Add a Circle</h3>
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
      <b-form-group v-if="$store.getters.isAdmin" label-for="allow-input">
        <b-form-checkbox
          v-model="circle.allowChildren"
          name="allow-input"
          button-variant="secondary"
          button
          :value="true"
          :unchecked-value="false"
        >
          <span v-if="circle.allowChildren">Attendees can add circles</span>
          <span v-else>Only admins can add circles</span>
        </b-form-checkbox>
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import {Circle} from '../../models/index'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CreateCircleModal',
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
      this.checkFormValidity()
      return this.circle && !this.circle.name
        ? 'Name is required'
        : 'Name already used by another circle'
    }
  },
  methods: {
    async checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      const unique = !(await this.$store.dispatch(
        'lookupCircle',
        this.circle.name
      ))

      this.formState = valid && unique
      return valid && unique
    },
    resetModal() {
      this.circle = new Circle()
      this.formState = null
    },
    async handleSubmit() {
      if ((await this.checkFormValidity()) === false) {
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
