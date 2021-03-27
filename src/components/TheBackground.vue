<template>
  <div class="background">
    <ul class="dots" v-for="x in Array(amount).keys()" :key="'adot-' + x">
      <li :style="genCircle()" />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TheBackground',
  data() {
    return {
      amount: 12,
      pushBias: 0
    }
  },
  methods: {
    genCircle() {
      const color = Math.random() > 0.5 ? 'var(--indigo)' : 'var(--blue)'
      this.pushBias = this.pushBias > window.innerWidth / 2 ? 0 : this.pushBias
      const startBias = Math.random() < 0.2
      const left = (Math.random() * 98 + this.pushBias).toFixed(0)
      const minSize = 20
      const size = (Math.random() * 100 + minSize).toFixed(0)
      const delay = (Math.random() * 30).toFixed(0)
      const duration = 60 - Math.random() * 6 - (size / 4).toFixed(0)
      return `
        background: ${color};
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${startBias ? 0 : delay}s;
        animation-duration: ${duration}s;
      `
    }
  }
}
</script>
<style scoped>
* {
  margin: 0px;
  padding: 0px;
}

.background {
  z-index: 1 !important;
  background-color: var(--gray-dark);
  width: 100%;
  height: 100vh;
}

.dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dots li {
  position: absolute;
  display: block;
  list-style: none;
  animation: animate 60s linear infinite;
  bottom: -150px;
  border-radius: 100%;
}

@keyframes animate {
  0% {
    transform: perspective(500px) translate3d(0, -100px, 0);
    opacity: 0;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    transform: perspective(500px) translate3d(0, -1200px, 200px);
    opacity: 0;
  }
}
</style>
