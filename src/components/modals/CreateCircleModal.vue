<template>
  <BaseModal
    :modal-id="modalId"
    :no-close="false"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="circleform" @submit.stop.prevent="handleSubmit">
      <div class="h5 text-info mt-n2 text-truncate">
        {{ $store.state.currentCircle ? $store.state.currentCircle.name : '' }}
      </div>
      <h3>
        Add a Circle
      </h3>
      <b-form-group
        label-for="name-input"
        class="pt-2 mr-1 text-white"
        :invalid-feedback="nameFeedback"
        :state="formState"
      >
        <b-form-input
          id="name-input"
          v-model="circle.name"
          placeholder="Circle name"
          :formatter="v => (v.length > 23 ? v.substring(0, 23) : v)"
          trim
          required
          autofocus
          @keypress="this.formatIdInput"
          @keyup="() => (formState = $refs.circleform.checkValidity())"
        />
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
      return this.circle && !this.circle.name
        ? 'Name is required'
        : 'Name already used by another circle'
    }
  },
  methods: {
    async checkFormValidity() {
      const valid = this.$refs.circleform.checkValidity()
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
