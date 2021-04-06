<template>
  <b-row
    align-h="start"
    no-gutters
    class="fixed-bottom ml-1"
    :class="{faded: loading}"
  >
    <b-col cols="auto" class="mx-1 mb-2">
      <DblStageBtn
        btn-text="Exit Gathering"
        :callback="leaveGathering"
        classess="w-100"
      />
    </b-col>
    <b-col v-if="currentCircle" cols="auto" class="mx-1 mb-2">
      <b-button class="w-100" @click="addCircle">
        Add Circle
      </b-button>
    </b-col>
    <b-col v-if="currentCircle" cols="auto" class="mx-1 mb-2">
      <DblStageBtn
        btn-text="Leave Circle"
        :callback="leaveCircle"
        classess="w-100"
      />
    </b-col>
    <b-col v-if="currentCircle" cols="auto" class="mx-1 mb-2">
      <b-button class="w-100" @click="handleZooming">
        {{ this.zoomReset ? 'Zoom to Circle' : 'Map View' }}
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
  methods: {
    leaveGathering() {
      window.location = '/'
      this.$emit('left-gathering')
      this.zoomReset = false
    },
    addCircle() {
      this.$emit('add-circle')
    },
    leaveCircle() {
      this.$emit('leave-circle')
      this.zoomReset = false
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
