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
    },
    listenOnly: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // this.openOrJoin(this.roomId)
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

      // this.connection.onstream = function(event) {
      //   var width =
      //     parseInt(this.connection.audiosContainer.clientWidth / 2) - 20
      //   var mediaElement = this.getHTMLMediaElement(event.mediaElement, {
      //     title: event.userid,
      //     buttons: ['full-screen'],
      //     width: width,
      //     showOnMouseEnter: false
      //   })

      //   this.connection.audiosContainer.appendChild(mediaElement)

      //   setTimeout(function() {
      //     mediaElement.media.play()
      //   }, 5000)

      //   mediaElement.id = event.streamid
      // }

      this.connection.onstreamended = function(event) {
        var mediaElement = document.getElementById(event.streamid)
        if (mediaElement) {
          mediaElement.parentNode.removeChild(mediaElement)
        }
      }

      this.connection.openOrJoin(roomId)
    },
    leave() {
      this.connection.leave()
    }
  },
  beforeDestroy() {
    this.leave()
  }
}
</script>
<style>
audio {
  margin-top: 82px;
  /* display: none; */
}
</style>
