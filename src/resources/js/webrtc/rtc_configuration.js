// webrtc Peer Connection 만들 때 필요한 configuration 값
// 사용할 ICE 서버를 정합니다.

export const rtcConfiguration = {
  iceServers: [{
    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
  }]
}
