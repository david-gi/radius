<template>
  <b-overlay
    class="p-0 m-0"
    :class="{'cursor-busy': !loaded}"
    :show="!loaded"
    rounded="sm"
    variant="dark"
    opacity="0.2"
    spinner-variant="info"
    z-index="9999"
  >
    <template #overlay>
      <div class="h1" style="transform: scale(2)">
        <b-spinner variant="primary" class="position-absolute" type="grow" />
        <b-spinner variant="info" class="position-absolute" />
        <b-spinner variant="secondary" small class="m-2 position-absolute" />
      </div>
    </template>
    <b-container fluid class="p-0 m-0">
      <b-row
        no-gutters
        class="fixed-top h-100 w-100 p-0 m-0 zindex-sticky"
        align-v="stretch"
      >
        <b-col id="top" cols="12">
          <GatheringMap v-if="hasGathering && hasUser && !showSecurity" />
        </b-col>
      </b-row>
      <div v-if="false" id="bottom" class="fixed-bottom">
        <div
          v-for="user in currentAttendees"
          :key="'uc-' + user.name"
          class="d-inline-block"
        >
          <UserCard :user="user" />
        </div>
      </div>
    </b-container>
    <TheHeader />
    <TheBackground />

    <SecurityModal v-if="loaded && showSecurity" />
    <CreateUserModal
      v-if="loaded && !noGatheringId && !hasUser && !showSecurity"
    />
    <CreateGatheringModal
      v-if="loaded && noGatheringId && !hasUser && !showSecurity"
    />
    <TheMessageBox />

    <input
      id="clipboard-input"
      type="text"
      class="fixed-bottom"
      style="z-index:-1; opacity:0;"
    />
  </b-overlay>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import TheMessageBox from '@/components/TheMessageBox.vue'
import UserCard from '@/components/UserCard.vue'
import TheBackground from '@/components/TheBackground.vue'
import SecurityModal from '@/components/modals/SecurityModal.vue'
import CreateUserModal from '@/components/modals/CreateUserModal.vue'
import CreateGatheringModal from '@/components/modals/CreateGatheringModal.vue'
import GatheringMap from '@/components/GatheringMap.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheMessageBox,
    UserCard,
    TheBackground,
    SecurityModal,
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
    showSecurity() {
      return this.$store.state.showSecurity
    },
    hasGathering() {
      return this.$store.state.gathering
    },
    noGatheringId() {
      return (
        !this.$store.state.gathering ||
        (this.$store.state.gathering && !this.$store.state.gathering.id)
      )
    },
    currentAttendees() {
      return this.$store.state.currentCircle
        ? this.$store.state.currentCircle.attendees
        : []
    }
  },
  mounted() {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      this.$store.dispatch('fetchGathering', id)
    }
    window.addEventListener('hashchange', this.handeHashChange)
    window.addEventListener('contextmenu', e => {
      e.preventDefault()
    })
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
