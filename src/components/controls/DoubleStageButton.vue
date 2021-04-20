<template>
  <b-button
    :variant="clickCount ? 'warning' : 'secondary'"
    :class="classes"
    @click="handleClick"
    :title="btnTitle"
  >
    <slot />
  </b-button>
</template>

<script>
export default {
  name: 'DoubleStageButton',
  props: {
    callback: Function,
    btnTitle: String,
    classes: String
  },
  data() {
    return {
      clickCount: 0,
      timer: null
    }
  },
  methods: {
    handleClick() {
      clearTimeout(this.timer)
      if (this.clickCount++ > 0) {
        this.$store.dispatch('displayMessage', {
          msg: '',
          time: 10
        })
        this.callback()
      } else {
        this.$store.dispatch('displayMessage', {
          msg: this.btnTitle + '?',
          time: 2200
        })
      }
      this.timer = setTimeout(() => {
        this.clickCount = 0
      }, 1600)
    }
  }
}
</script>
<style></style>
