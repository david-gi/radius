<template>
  <b-navbar variant=" " class="fixed-top m-0 p-0 pt-1">
    <b-navbar-nav>
      <b-nav-item href="/" class="mt-n1 pl-1 user-select-none text-nowrap">
        <img
          alt="circletalk"
          title="circletalk"
          src="../assets/logo.svg"
          width="40"
          class="mt-1"
        />
        <strong class="text-white h4 align-middle shadow-text">
          circletalk
        </strong>
        <small class="text-success align-bottom ml-n3 d-inline-block mb-n1">beta</small>
      </b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="shadow-text d-none d-sm-inline">
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
