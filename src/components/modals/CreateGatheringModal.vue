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
          <div
            id="intro"
            v-if="expanded"
            class="font-weight-normal responsive-font-size mt-3"
          >
            <strong class="text-warning">
              Innovative voice conferencing that puts privacy first.
            </strong>
            <ul>
              <li>End-to-end encryption with zero middlemen</li>
              <li>Peer-to-peer with zero media proxying</li>
              <li>Created & run by a single developer</li>
              <li>No data profiteering of any kind</li>
              <li>No data permanence</li>
              <li>No data harvesting</li>
              <li>No user tracking</li>
            </ul>
            <strong class="text-warning">
              How does it work?
            </strong>
            <ol>
              <li>
                Start a gathering or join by link
              </li>
              <li>Fill out your name tag</li>
              <li>
                Double-<span class="d-none d-sm-inline">click</span>
                <span class="d-inline d-sm-none">tap</span> to join a circle's
                conversation
              </li>
              <li>
                Add an inner circle
                <ul class="p-0 pl-3">
                  <li>
                    Talk inside an inner circle while still hearing its
                    containing circle
                  </li>
                  <li>Add another circle for private conversations</li>
                </ul>
              </li>
              <li>Your data is deleted when you leave</li>
              <li>Gathering data is deleted once everyone leaves</li>
            </ol>
          </div>
        </h2>
        <small
          v-if="!expanded"
          class="font-weight-bold text-info pointer faded"
          @click="expanded = true"
        >
          <u class="pr-1">Find out more</u>
        </small>
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
import TopicTagpicker from '../controls/TopicTagpicker.vue'

export default {
  name: 'CreateGatheringModal',
  components: {BaseModal, TopicTagpicker},
  data() {
    return {
      modalId: 'create-gathering-modal',
      expanded: false,
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
