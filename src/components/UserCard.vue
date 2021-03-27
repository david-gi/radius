<template>
  <div
    :id="`user-card-${this.user.name}`"
    class="user-card text-center pointer mx-1 mb-2 border-dark bg-dark rounded-circle d-inline-block user-select-none"
    @click="copyToClip(user.name + ' - ' + (user.scratchpad || ' '))"
    v-b-tooltip.click
    title="Details Copied!"
  >
    <b-aspect
      aspect="1:1"
      class="img-aspect rounded-circle"
      :style="{backgroundImage: `url(${user.img})`}"
    >
      <b-icon-person-fill
        v-show="!user.img"
        variant="white"
        scale="5"
        class="mt-5 pt-4"
      />
    </b-aspect>
    <div class="text-white text-truncate" style="margin-top:-3.5vh;">
      <strong class="user-name-bg">{{ user.name }}</strong>
    </div>
  </div>
</template>

<script>
import {User} from '../models/index'

export default {
  name: 'UserCard',
  props: {
    user: User
  },
}
</script>
<style>
.user-card {
  width: 20vh;
  height: 20vh;
  border-style: solid;
  border-width: 0.5rem !important;
}
.img-aspect {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.user-name-bg {
  width: 9vh;
  display: inline-block;
  text-shadow: 0 2px 4px #000000;
}
</style>
