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
      V: null,
      connection: new RTCMultiConnection()
    }
  },
  mounted() {
    this.thisRef = this
    this.startConnection(this.room)
    window.addEventListener('beforeunload', this.leave)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.leave)
    this.leave()
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

      // this.connection.onopen = event => {
      //   // this.connection.send(event.userid)
      // }

      // this.connection.onmessage = event => {
      //   //alert(event.userid + ' said: ' + event.data)
      // }
      this.connection.onstream = this.onstream
      //this.connection.onstreamended = this.onstreamended
      //this.connection.connectSocket(function() { alert('socket') })
      //this.connection.openOrJoin(roomId) //, this.joined)
      this.loadOff()
    },

    joined(isRoomCreated, roomid, error) {
      this.loadOff()
      //if (this.connection.isInitiator === true)
      if (error) this.msg(error)
    },

    onstream: event => {
      document.firstChild().prepend(event.mediaElement)
      //this.connection.audiosContainer = document.getElementById('bottom')
      //var width = parseInt(this.connection.audiosContainer.clientWidth / 2) - 20
      var mediaElement = this.getHTMLMediaElement(event.mediaElement, {
        title: event.userid,
        buttons: [],
        width: 120,
        showOnMouseEnter: false
      })

      // this.V.connection.audiosContainer.appendChild(mediaElement)
      document.firstChild().prepend(mediaElement)

      setTimeout(function() {
        mediaElement.media.play()
      }, 3000)

      mediaElement.id = event.streamid
    },

    onstreamended: event => {
      var mediaElement = document.getElementById(event.streamid)
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement)
      }
    },

    leave() {
      if (this.connection) {
        this.connection.leave()
        this.connection = null
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
