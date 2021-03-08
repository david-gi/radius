<template>
  <div class="home">
    <TheHeader />
    <div class="position-fixed w-100 pt-5">
      <Map />
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import Map from '@/components/CirclePackMap.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    Map
  }
}
</script>
