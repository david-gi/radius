<template>
  <div v-if="loaded" class="p-0 m-0 mw-100">
    <div class="text-center">
      <Landing v-if="noGathering" />
      <GatheringMap v-else />
    </div>
    <TheHeader />
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
    loaded() {
      return !this.$store.state.loading
    },
    noGathering() {
      return !this.$store.state.gathering
    }
  },
  mounted() {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      this.$store
        .dispatch('fetchGathering', id)
        .then(() => this.$store.commit('SET_LOADING', false))
    } else {
      this.$store.commit('SET_LOADING', false)
    }
  }
}
</script>
