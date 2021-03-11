<template>
  <b-navbar variant=" " class="fixed-top zindex-fixed bg-primary m-0 p-0">
    <b-navbar-nav>
      <b-nav-item-dropdown no-caret menu-class="border-primary ml-2 ">
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <img
            alt="radius.io - Gather | Mingle | Connect"
            title="radius.io - Gather | Mingle | Connect"
            src="../assets/logo.png"
            class="rounded-circle hoverable"
            width="60"
          />
        </template>
        <b-dropdown-item href="#">
          {{ room }}
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav>
      <b-nav-item :href="`#${$store.state.gathering.name}`">
        <strong class="text-white">
          {{ $store.state.gathering.name }}
        </strong>
      </b-nav-item>
      <b-nav-item
        v-show="room"
        :href="`#${$store.state.gathering.name}/${room}`"
        class="border-left border-white"
      >
        <strong class="text-white">
          {{ room }}
        </strong>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'TheHeader',
  computed: {
    room() {
      return this.$store.state.currentCircle
        ? this.$store.state.currentCircle.name
        : null
    }
  }
}
</script>
