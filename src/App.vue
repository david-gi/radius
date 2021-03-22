<template>
  <div v-if="loaded" class="p-0 m-0">
    <Background>
      <CreateUserModal v-if="!hasUser" />
      <CreateGatheringModal v-if="noGatheringId && hasUser" />
      <GatheringMap v-if="hasGathering && hasUser" />
    </Background>
    <MessageBox />
    <TheHeader />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import MessageBox from '@/components/MessageBox.vue'
import Background from '@/components/Background.vue'
import CreateUserModal from '@/components/modals/CreateUserModal.vue'
import CreateGatheringModal from '@/components/modals/CreateGatheringModal.vue'
import GatheringMap from '@/components/GatheringMap.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    MessageBox,
    Background,
    CreateUserModal,
    CreateGatheringModal,
    GatheringMap
  },
  data() {
    return {
      hasUser: this.$store.state.user
    }
  },
  computed: {
    loaded() {
      return !this.$store.state.loading
    },
    hasGathering() {
      return this.$store.state.gathering
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
      this.$store.dispatch('fetchGathering', id).then(() => {
        this.$store.commit('SET_LOADING', false)
      })
    } else {
      this.$store.commit('SET_LOADING', false)
    }
    window.addEventListener('hashchange', this.handeHashChange)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.handeHashChange)
  },
  watch: {
    '$store.state.route': function(v) {
      window.location.hash = v
    },
    '$store.state.user': function() {
      this.hasUser = this.$store.state.user
    }
  },
  methods: {
    handeHashChange() {
      if (!window.location.hash) return
      this.$store.dispatch('fetchGathering', window.location.hash.substring(1))
    }
  }
}
</script>
