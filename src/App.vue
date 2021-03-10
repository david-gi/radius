<template>
  <div class="p-0 m-0 mw-100">
    <TheHeader />
    <div class="text-center">
      <Landing v-if="noGathering" />
      <GatheringMap v-else />
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import Landing from '@/components/Landing.vue'
import GatheringMap from '@/components/GatheringMap.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    Landing,
    GatheringMap
  },
  computed: {
    noGathering: () => !this.$store.state.gathering
  },
  beforeMount() {
    const id = window.location.hash.substring(1)
    this.$store.dispatch('/fetchGathering', id)
  }
}
</script>
