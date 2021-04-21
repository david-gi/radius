<template>
  <BaseModal
    :modal-id="modalId"
    :noClose="true"
    @on-reset="resetModal"
    @on-submit="handleSubmit"
  >
    <form ref="gatheringform" @submit.stop.prevent="handleSubmit">
      <div class="h2 bg-secondary rounded mx-n5 mt-n2 mb-4 px-5 py-4 shadow-md">
        <div class="align-top text-infox mr-2">circletalk</div>
        <div class="h5 mt-n1 text-info">gather • mingle • connect</div>

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
          autofocus
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
      <div class="h5 mb-0">Setup starter circles</div>
      <b-form-group label-for="circles-input" class="pt-2 mr-1 text-white">
        <b-form-tags
          placeholder="Enter a circle name..."
          input-id="circles-input"
          v-model="circles"
          tag-class="bg-primary"
          input-class="bg-white"
          add-button-variant="primary"
        >
          <template
            v-slot="{tags, inputId, placeholder, disabled, addTag, removeTag}"
          >
            <div
              v-for="tag in tags"
              :key="tag"
              :title="`Tag: ${tag}`"
              class="rounded bg-primary py-2 pl-3 my-2"
            >
              <span>{{ tag }}</span>
              <b-button
                size="sm"
                variant=" "
                class="py-1 pr-0 pl-2 float-right"
                @click="removeTag(tag)"
              >
                <b-icon-x variant="white align-top mr-1" />
              </b-button>
            </div>
            <b-input-group>
              <b-form-input
                v-model="newTag"
                :id="inputId"
                :placeholder="placeholder"
                @keypress="e => formatIdInput(e)"
              ></b-form-input>
              <b-button
                @click="() => { addTag(newTag); newTag = ''; }"
                :disabled="disabled"
                variant="primary"
                size="sm"
              >
                Add
              </b-button>
            </b-input-group>
          </template>
        </b-form-tags>
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
      newTag: '',
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
