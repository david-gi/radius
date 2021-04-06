<template>
  <b-navbar variant=" " class="fixed-top zindex-fixed m-0 p-0 pt-1">
    <b-navbar-nav>
      <b-nav-item-dropdown
        :disabled="!$store.state.gathering"
        no-caret
        class="user-select-none"
        menu-class="ml-2 user-select-none"
      >
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <img
            alt="Concentric.io"
            title="Concentric.io"
            src="../assets/logo.svg"
            class="hoverable mt-n1"
            width="40"
          />
          <strong class="text-white h4 pl-1 shadow-text">circletalk</strong>
        </template>
        <b-dropdown-item variant="info" @click="leave">
          Start a new Gathering
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav class="mt-n2 shadow-text d-inline">
      <b-nav-text
        v-if="$store.state.gathering && $store.state.gathering.name"
        class="p-0"
      >
        <strong
          v-if="$store.state.gathering"
          class="text-white mx-2 text-nowrap"
        >
          #{{ $store.state.gathering.name }}
        </strong>
      </b-nav-text>
      <b-nav-text v-if="room" class="p-0" title="Talking/Listening">
        <strong class="text-info mx-1 text-nowrap">
          <b-icon-mic-fill scale=".8" variant="info" class="mr-n1" />
          {{ room }}
        </strong>
      </b-nav-text>
      <b-nav-text v-if="parentRoom" class="p-0" title="Listening only">
        <strong class="text-warning ml-1 text-nowrap">
          <b-icon-music-note scale=".8" variant="warning" class="mr-n2" />
          {{ parentRoom }}
        </strong>
      </b-nav-text>
    </b-navbar-nav>
    <b-nav-text>
      <TheLoader />
    </b-nav-text>
  </b-navbar>
</template>

<script>
import TheLoader from '@/components/TheLoader.vue'

export default {
  name: 'TheHeader',
  components: {
    TheLoader
  },
  computed: {
    room() {
      return this.$store.state.currentCircle
        ? this.$store.state.currentCircle.name
        : null
    },
    parentRoom() {
      return this.$store.getters.currentParent
        ? this.$store.getters.currentParent.name
        : null
    }
  },
  methods: {
    async leave() {
      window.location = '/'
    }
  }
}
</script>
