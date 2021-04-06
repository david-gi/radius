<template>
  <div />
</template>

<script>
import RTCMultiConnection from 'rtcmulticonnection'

export default {
  name: 'WebRtcRoom',
  props: {
    room: String,
    video: {
      type: Boolean,
      default: false
    },
    audio: {
      type: Boolean,
      default: true
    },
    listenOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      V: this,
      connection: new RTCMultiConnection()
    }
  },
  mounted() {
    this.startConnection(this.room)
    window.addEventListener('beforeunload', this.leave)
  },
  beforeDestroy() {
    this.leave()
    window.removeEventListener('beforeunload', this.leave)
  },

  methods: {
    startConnection(roomId) {
      this.loadOn()
      const sUrl = !roomId.x
        ? 'https://rtcmulticonnection.herokuapp.com:443/'
        : 'http://localhost:9001/'
      this.connection.socketURL = sUrl
      this.connection.maxParticipantsAllowed = 25
      this.connection.session = {
        audio: this.audio,
        video: this.video
        //data: true
      }
      this.connection.mediaConstraints = {
        audio: this.audio && !this.listenOnly,
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

      this.connection.onstream = this.onstream
      this.connection.onstreamended = this.onstreamended
      this.connection.openOrJoin(roomId)
      this.loadOff()
    },

    onstream: function(event) {
      this.V.connection.audiosContainer = document.getElementById('top')
      const mediaElement = event.mediaElement
      mediaElement.removeAttribute('controls')
      mediaElement.setAttribute('autoplay', true)
      mediaElement.setAttribute('muted', false)
      mediaElement.setAttribute('volume', this.listenOnly ? 50 : 100)

      this.V.connection.audiosContainer.appendChild(mediaElement)

      mediaElement.id = event.streamid
    },

    onstreamended: event => {
      var mediaElement = document.getElementById(event.streamid)
      if (mediaElement) mediaElement.remove()
    },

    leave() {
      if (this.connection) {
        this.connection.attachStreams.forEach(function(localStream) {
          localStream.stop()
        })
        this.connection.closeSocket()
      }
    }
  }
}
</script>
<style>
audio {
  /* position: fixed;
  bottom: 0; */
  margin: 2px;
  z-index: 9999999;
}
</style>
