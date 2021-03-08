<template>
  <div />
</template>

<script>
import RTCMultiConnection from 'rtcmulticonnection'

export default {
  name: 'WebRtcRoom',
  data() {
    return {
      connection: new RTCMultiConnection()
    }
  },
  props: {
    room: String,
    video: {
      type: Boolean,
      default: false
    },
    audio: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.openOrJoin(this.roomId)
  },
  watch: {
    room(val) {
      this.leave()
      this.openOrJoin(val)
    }
  },
  methods: {
    openOrJoin(roomId) {
      const sUrl = 'https://rtcmulticonnection.herokuapp.com:443/'
      this.connection.socketURL = sUrl
      // connection.socketURL = 'http://localhost:9001/'

      this.connection.session = {
        audio: this.audio,
        video: this.video
      }

      this.connection.mediaConstraints = {
        audio: this.audio,
        video: this.video
      }

      this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: this.audio,
        OfferToReceiveVideo: this.video
      }

      this.connection.iceServers = [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun.l.google.com:19302?transport=udp'
          ]
        }
      ]

      this.connection.openOrJoin(roomId)
    },
    leave() {
      this.connection.leave()
    }
  },
  destroyed() {
    this.leave()
  }
}
</script>
<style>
audio {
  display: none;
}
</style>
