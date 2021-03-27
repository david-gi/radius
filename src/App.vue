<template>
  <div class="p-0 m-0">
    <div>
      <b-container fluid class="p-0 m-0">
        <b-row
          no-gutters
          class="zindex-sticky fixed-top h-100 w-100 p-0 m-0"
          align-v="stretch"
        >
          <b-col id="top" cols="12">
            <SecurityModal v-if="showSecurity" />
            <CreateUserModal v-if="!hasUser && !showSecurity" />
            <CreateGatheringModal
              v-if="noGatheringId && hasUser && !showSecurity"
            />
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
      <TheBackground />
      <input
        id="clipboard-input"
        type="text"
        class="fixed-bottom"
        style="z-index:-1; opacity:0;"
      />
    </div>
    <TheMessageBox />
    <TheHeader />
  </div>
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
    // window.addEventListener('contextmenu', e => {
    //   e.preventDefault()
    // })
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
