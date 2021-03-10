<template>
  <b-navbar variant=" " class="fixed-top bg-primary m-0 p-0">
    <b-nav-item-dropdown no-caret menu-class="border-0 ml-4">
      <!-- Using 'button-content' slot -->
      <template #button-content>
        <img
          alt="radius.io - Gather | Mingle | Connect"
          title="radius.io - Gather | Mingle | Connect"
          src="../assets/logo.png"
          class="ml-n2"
          width="60"
        />
      </template>
      <b-dropdown-item href="#">{{ room || 'Lobby' }}</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-navbar-nav>
      <b-nav-item href="#">
        <strong class="text-white">
          {{ room || 'Lobby' }}
        </strong>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'TheHeader',
  computed: {
    room: () => this.$store.state.currentRoom
  }
}
</script>
