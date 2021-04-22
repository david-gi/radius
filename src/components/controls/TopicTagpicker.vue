<template>
  <b-form-tags
    placeholder="Enter a topic..."
    input-id="circles-input"
    v-model="lValue"
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
          @click="
            () => {
              addTag(newTag)
              newTag = ''
            }
          "
          :disabled="disabled"
          variant="primary"
          size="sm"
        >
          Add
        </b-button>
      </b-input-group>
    </template>
  </b-form-tags>
</template>

<script>
export default {
  name: 'TopicTagpicker',
  props: ['value'],
  data() {
    return {
      lValue: this.value,
      newTag: ''
    }
  },
  updated() {
    this.handleChange()
  },
  methods: {
    handleChange() {
      this.$emit('input', this.lValue)
    }
  }
}
</script>
