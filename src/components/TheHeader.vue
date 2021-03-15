<template>
  <b-navbar
    variant=" "
    class="fixed-top zindex-fixed m-0 p-0"
  >
    <b-navbar-nav>
      <b-nav-item-dropdown no-caret menu-class="border-primary ml-2">
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <img
            alt="Radius.io"
            title="Radius.io"
            src="../assets/logo.png"
            class="rounded-circle hoverable"
            width="60"
          />
          <strong class="text-white h5 ml-2 pl-1">Radius<small>.io</small></strong>
        </template>
        <b-dropdown-item href="#">
          {{ room }}
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav class="mt-n1 ml-n2">
      <b-nav-item
        v-if="$store.state.gathering"
        :href="`#${$store.state.gathering.name}`"
      >
        <b-icon-arrow-right-short scale="1.5" variant="white" />
        <strong
          v-if="$store.state.gathering"
          class="text-white ml-1 text-nowrap"
        >
          {{ $store.state.gathering.name }}
        </strong>
      </b-nav-item>
      <b-nav-item
        v-if="room"
        :href="`#${$store.state.gathering.name}/${room}`"
        class="ml-n2"
      >
        <b-icon-arrow-right-short scale="1.5" variant="white" />
        <strong class="text-white ml-1 text-nowrap">
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
