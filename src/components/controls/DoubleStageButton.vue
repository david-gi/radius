<template>
  <b-button
    :variant="clickCount ? 'primary' : 'secondary'"
    :class="classes"
    @click="handleClick"
  >
    {{ clickCount ? btnText + '?' : btnText }}
  </b-button>
</template>

<script>
export default {
  name: 'DoubleStageButton',
  props: {
    callback: Function,
    btnText: String,
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
      if (this.clickCount++ > 0) this.callback()
      this.timer = setTimeout(() => {
        this.clickCount = 0
      }, 1600)
    }
  }
}
</script>
<style></style>
