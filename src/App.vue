<template>
  <div v-if="loaded" class="p-0 m-0 mw-100">
    <Background>
      <CreateGatheringModal v-if="noGatheringId" />
      <GatheringMap v-if="!noGathering" />
    </Background>
    <TheHeader />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import Background from '@/components/Background.vue'
import CreateGatheringModal from '@/components/modals/CreateGatheringModal.vue'
import GatheringMap from '@/components/GatheringMap.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    Background,
    CreateGatheringModal,
    GatheringMap
  },
  computed: {
    loaded() {
      return !this.$store.state.loading
    },
    noGathering() {
      return !this.$store.state.gathering
    },
    noGatheringId() {
      return (
        !this.$store.state.gathering ||
        (this.$store.state.gathering && !this.$store.state.gathering.id)
      )
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
  },
  watch: {
    noGathering() {
      if (this.$store.state.gathering.name) {
        window.location.hash = this.$store.state.gathering.name.replace(' ', '')
      }
    }
  }
}
</script>
