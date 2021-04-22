<template>
  <div class="bg-secondary mx-auto p-1 text-center">
    <b-button v-if="supported" @click="takeSnapshot" title="Take a Selfie">
      <b-img
        :src="selfie || '/placeholder.svg'"
        width="140"
        height="140"
        class="d-block my-1"
      />
      <b-icon-camera-fill />
      <span class="ml-2 font-weight-normal">Take a Selfie</span>
    </b-button>

    <b-img
      v-if="!supported"
      :src="'/placeholder.svg'"
      width="140"
      height="140"
      class="d-block my-1"
      title="Update your browser"
    />
    <div v-if="!supported" class="mt-n4 mb-4" title="Update your browser">
      Camera unavailable
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSnapshot',
  props: ['value'],
  data() {
    return {
      selfie: null,
      supported: true,
      constraints: {
        facingMode: 'user',
        width: 140,
        height: 140,
        aspectRatio: 1
      }
    }
  },
  methods: {
    async takeSnapshot() {
      let camera
      try {
        camera = await navigator.mediaDevices.getUserMedia({
          video: this.constraints
        })
        const imageCapture = new ImageCapture(camera.getVideoTracks()[0])
        const imgData = await imageCapture.takePhoto()
        this.selfie = await this.setAspectRatio(URL.createObjectURL(imgData))
        this.$emit('input', this.selfie)
        camera.getTracks().forEach(track => {
          track.stop()
        })
      } catch (e) {
        this.supported = false
        console.error(e)
        if (camera) {
          camera.getTracks().forEach(track => {
            track.stop()
          })
        }
      }
    },
    setAspectRatio: url => {
      return new Promise(resolve => {
        const aspectRatio = 1
        let inputImage = new Image()
        inputImage.onload = () => {
          const inputWidth = inputImage.naturalWidth
          const inputHeight = inputImage.naturalHeight
          const inputImageAspectRatio = inputWidth / inputHeight

          let outputWidth = inputWidth
          let outputHeight = inputHeight
          if (inputImageAspectRatio > aspectRatio) {
            outputWidth = inputHeight * aspectRatio
          } else if (inputImageAspectRatio < aspectRatio) {
            outputHeight = inputWidth / aspectRatio
          }

          const outputX = (outputWidth - inputWidth) * 0.5
          const outputY = (outputHeight - inputHeight) * 0.5
          const outputImage = document.createElement('canvas')
          outputImage.width = outputWidth
          outputImage.height = outputHeight

          const ctx = outputImage.getContext('2d')
          ctx.drawImage(inputImage, outputX, outputY)
          resolve(outputImage.toDataURL('image/jpeg'))
        }

        inputImage.src = url
      })
    }
  }
}
</script>
<style></style>
