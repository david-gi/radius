<template>
  <BaseModal
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="gatheringform" @submit.stop.prevent="handleSubmit">
      <div class="bg-secondary rounded mx-n5 mt-n2 mb-4 px-5 py-4 shadow-md">
        <h1 class="h2 align-top text-infox mr-2">circletalk</h1>
        <h3 class="h5 mt-n1 text-info">gather • mingle • connect</h3>
        <h2 class="h6">
          Free and simple audio conferencing!
          <br />
          Listen to the gathering, talk within circles.
          <br />
          <small class="faded">
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/Privacy_by_design#Foundational_principles"
              class="text-white"
            >
              <abbr title="Learn about privacy by design [wikipedia]">
                Privacy by Design
              </abbr>
            </a>
            - No Sign Up - Ethical Freeware
          </small>
          <br />
          <Intro />
        </h2>
      </div>
      <div class="h4 mt-n2">
        Start a Gathering
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
          :formatter="v => (v.length > 23 ? v.substring(0, 23) : v)"
          required
          @keypress="this.formatIdInput"
        />
      </b-form-group>
      <b-form-group label-for="description-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="description-input"
          v-model="gathering.description"
          placeholder="Tagline"
          :formatter="v => (v.length > 300 ? v.substring(0, 300) : v)"
        />
      </b-form-group>
      <b-form-group label-for="password-input" class="pt-2 mr-1 text-white">
        <b-form-input
          id="password-input"
          v-model.lazy.trim="gathering.password"
          placeholder="Password"
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
      <div class="h6 mb-0">Setup event topics</div>
      <b-form-group label-for="circles-input" class="pt-2 mr-1 text-white">
        <TopicTagpicker v-model="circles" />
      </b-form-group>
    </form>
  </BaseModal>
</template>

<script>
import {Circle, Gathering} from '../../models/index'
import BaseModal from './BaseModal.vue'
import Intro from '../Intro.vue'
import TopicTagpicker from '../controls/TopicTagpicker.vue'

export default {
  name: 'CreateGatheringModal',
  components: {BaseModal, Intro, TopicTagpicker},
  data() {
    return {
      modalId: 'create-gathering-modal',
      gathering: new Gathering(),
      circles: ['General'],
      formState: null
    }
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
      this.circles = ['General']
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
