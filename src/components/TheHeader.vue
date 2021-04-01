<template>
  <b-navbar variant=" " class="fixed-top zindex-fixed m-0 p-0">
    <b-navbar-nav>
      <b-nav-item-dropdown
        :disabled="!$store.state.gathering"
        no-caret
        class="user-select-none"
        menu-class="border-info bg-dark ml-2 user-select-none"
      >
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <img
            alt="Concentric.io"
            title="Concentric.io"
            src="../assets/logo.svg"
            class="hoverable"
            width="40"
          />
          <strong class="text-white h5 pl-3 shadow-text">circletalk</strong>
        </template>
        <b-dropdown-item variant="info" @click="leave">
          Leave
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav class="mt-n1 ml-n2 shadow-text">
      <b-nav-item v-if="$store.state.gathering && $store.state.gathering.name">
        <b-icon-arrow-right-short scale="1.5" variant="white" />
        <strong
          v-if="$store.state.gathering"
          class="text-white ml-1 text-nowrap"
        >
          {{ $store.state.gathering.name }}
        </strong>
      </b-nav-item>
      <b-nav-item v-if="parentRoom" class="ml-n2">
        <b-icon-arrow-right-short scale="1.5" variant="white" />
        <strong class="text-white ml-1 text-nowrap">
          {{ parentRoom }}
        </strong>
      </b-nav-item>
      <b-nav-item v-if="room" class="ml-n2">
        <b-icon-arrow-right-short scale="1.5" variant="white" />
        <strong class="text-white ml-1 text-nowrap">
          {{ room }}
        </strong>
      </b-nav-item>
    </b-navbar-nav>
    <b-nav-text class="ml-auto mr-2">
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
      return this.$store.getters.currentParent ? this.$store.getters.currentParent.name : null
    }
  },
  methods: {
    leave() {
      this.$store.dispatch('leaveCurrentCircle')
      this.$store.dispatch('leaveGathering')
      window.location = '/'
    }
  }
}
</script>
