<template>
  <b-row
    id="TheToolbar"
    align-h="start"
    no-gutters
    class="fixed-bottom ml-1"
    :class="{faded: loading}"
  >
    <b-col cols="auto" class="mx-2 mb-2">
      <DblStageBtn
        btn-title="Exit Gathering"
        :callback="leaveGathering"
        classess="w-100"
      >
        <b-icon-x-circle />
      </DblStageBtn>
    </b-col>
    <b-col v-if="currentCircle" cols="auto" class="mx-2 mb-2">
      <DblStageBtn
        btn-title="Leave Circle"
        :callback="leaveCircle"
        classess="w-100"
      >
        <b-icon-arrow-left-circle />
      </DblStageBtn>
    </b-col>
    <b-col v-if="currentCircle" cols="auto" class="mx-2 mb-2">
      <b-button class="w-100" @click="addCircle" title="Add Circle">
        <b-icon-plus-circle />
      </b-button>
    </b-col>
    <b-col v-if="currentCircle" cols="auto" class="mx-2 mb-2">
      <b-button
        class="w-100"
        @click="handleZooming"
        :title="this.zoomReset ? 'Zoom in' : 'Zoom out'"
      >
        <b-icon-zoom-in v-if="this.zoomReset" />
        <b-icon-zoom-out v-else />
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
import DblStageBtn from '@/components/controls/DoubleStageButton.vue'

export default {
  name: 'TheToolbar',
  components: {DblStageBtn},
  data() {
    return {
      zoomReset: false
    }
  },
  computed: {
    loading() {
      return Boolean(this.$store.state.loading)
    },
    currentCircle() {
      return Boolean(this.$store.state.currentCircle)
    }
  },
  watch: {
    '$store.state.currentCircle': {
      deep: true,
      handler() {
        this.zoomReset = false
      }
    }
  },
  mounted() {
    window.addEventListener('wheel', this.onZoom)
    window.addEventListener('gestureend', this.onPinch)
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.onZoom)
    window.removeEventListener('gestureend', this.onPinch)
  },
  methods: {
    clearFocus() {
      document.getElementById('TheToolbar').click()
      document.activeElement.blur()
    },
    leaveGathering() {
      window.location = '/'
      this.$emit('left-gathering')
      this.zoomReset = false
      this.clearFocus()
    },
    addCircle() {
      this.$emit('add-circle')
      this.clearFocus()
    },
    leaveCircle() {
      this.$emit('leave-circle')
      this.zoomReset = false
      this.clearFocus()
    },
    zoomResetTrue() {
      this.zoomReset = true
    },
    onZoom() {
      this.zoomResetTrue()
      this.clearFocus()
    },
    onPinch(e) {
      if (e.scale != 1.0) this.zoomResetTrue()
    },
    handleZooming() {
      if (!this.zoomReset) {
        this.$emit('reset-zoom')
        this.zoomReset = true
      } else {
        this.$emit('circle-zoom')
        this.zoomReset = false
      }
    }
  }
}
</script>
<style></style>
