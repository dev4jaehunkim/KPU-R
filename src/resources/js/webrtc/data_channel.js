/*
*
* For Data Channel (WebRTC)
*
*/

'use strict';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from './firebase_config.js'
import { rtcConfiguration } from './rtc_configuration.js';
import { convertUserInputTo5bitNumber, convert5bitNumberToUserInput } from './input_conversion.js';
import { UserInputWithSync } from '../keyboard.js'

let peerConnection = null;
let dataChannel = null;
let roomId = null,
    roomRef = null;

// ICE 리스트 [local, remote]
const localICECandDocRefs = [];

let gameObject;
let receivedInput = [
  0,
  0
]
export function getReceivedInput() {
  return receivedInput;
}

export let isGameStarted = false;

export function sendInputQueueToPeer(inputQueue) {
  const buffer = new ArrayBuffer(1);
  const dataView = new DataView(buffer);
  const input = inputQueue;
  const byte = convertUserInputTo5bitNumber(input);
  dataView.setUint8(0,byte);
  try {
    console.log(buffer);
    dataChannel.send(buffer);
  } catch(e) {console.log(e.message);}
}

function receiveInputQueueFromPeer(data) {
  const dataView = new DataView(data);
  const byte = dataView.getUint8(0);
  const input = convert5bitNumberToUserInput(byte);
  const peerInputWithSync = new UserInputWithSync(
    input.xDirection,
    input.yDirection
  );
  receivedInput= [input.xDirection, input.yDirection];

}

// index.html 에 있는 버튼들에 대해 event Linstener 등록
export function init(dungeonRouter) {
  gameObject = dungeonRouter;

  firebase.initializeApp(firebaseConfig);
  document.querySelector('#create-btn').addEventListener('click', createRoom);
  document.querySelector('#join-btn').addEventListener('click', joinRoom);
}

// 방 생성
export async function createRoom() {
  document.querySelector('#create-btn').disabled = true;
  document.querySelector('#join-btn').disabled = true;

  gameObject.amiPlayer2=false;

  // firestore DB를 통해서 각각의 피어 정보들을 저장하고,
  // 이를 이용해 피어끼리 서로 통신이 이루어지게 한다.
  const db = firebase.firestore();
  roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', rtcConfiguration);
  peerConnection = new RTCPeerConnection(rtcConfiguration);

  // Peer Connection Listener 설정
  registerPeerConnectionListeners();

  // ICE 할당 받아지면 DB에 저장
  collectIceCandidates(roomRef, peerConnection, 'offerorCandidates', 'answererCandidates');

  // 데이터 채널 연결
  dataChannel = peerConnection.createDataChannel('dungeonrouter_game_channel', {
    ordered: false,
    maxRetransmits: 0
  });
  console.log('Created data Channel', dataChannel);

  dataChannel.addEventListener('open', dataChannelOpened);
  dataChannel.addEventListener('message', recieveFromPeer);
  dataChannel.addEventListener('close', dataChannelClosed);

  // Offer 요청 생성
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer and set local description:', offer);
  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
  document.querySelector('#current-room-id').innerText = roomId;

  // 피어측에서 DB 업데이트 했는지 확인
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });

  // 피어에서 ICE 업데이트 했는지 확인
  roomRef.collection('answererCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

}

// 방 입장
export async function joinRoom() {
  document.querySelector('#create-btn').disabled = true;
  document.querySelector('#join-btn').disabled = true;

  gameObject.amiPlayer2=true;

  roomId = document.querySelector('#join-room-id-input').value;
  console.log('Join room: ', roomId);
  await joinRoomById(roomId);
}

async function joinRoomById(roomId) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  console.log('Got room:', roomSnapshot.exists);

  // Room ID가 존재하지 않을 때
  if (!roomSnapshot.exists) {
    console.log('No room is mathing the ID');
    return false;
  }

  // Room ID가 이미 다른 피어에서 사용되고 있을 때
  const data = roomSnapshot.data();
  if (data.answer) {
    console.log('The room is already joined by someone else');
    return false;
  }

  console.log('Create PeerConnection with configuration: ', rtcConfiguration);
  peerConnection = new RTCPeerConnection(rtcConfiguration);

  // Peer Connection Listener 설정
  registerPeerConnectionListeners();

  // ICE 할당 받아지면 DB에 저장
  collectIceCandidates(roomRef, peerConnection, 'answererCandidates', 'offerorCandidates');

  // Offer 정보 가져와서 remote 에 저장
  const offer = data.offer;
  await peerConnection.setRemoteDescription(offer);
  console.log('Set remote description');

  // Answer 요청 생성
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  console.log('set local description:', answer);
  const roomWithAnswer = {
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
  };
  await roomRef.update(roomWithAnswer);
  console.log('joined room!');

  // 피어에서 ICE 업데이트 했는지 확인
  roomRef.collection('offerorCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
}

// 데이터 채널 openned 리스너
function dataChannelOpened(event) {
  console.log('data channel opened!');
  console.log(`dataChannel.ordered: ${dataChannel.ordered}`);
  console.log(`dataChannel.maxRetransmits: ${dataChannel.maxRetransmits}`);
  dataChannel.binaryType = 'arraybuffer';
  isGameStarted = true;
}

// 데이터 채널 closed 리스너
function dataChannelClosed(event) {
  console.log('data channel closed');
}

// 데이터 받았을 때 리스너
function recieveFromPeer(event) {
  let data = event.data;
  receiveInputQueueFromPeer(data);
}

// 두 peerConnection에 대한 Listener 정의
function registerPeerConnectionListeners() {

  // ICE gathering 상태 변화
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`
    );
  });

  // connection 상태 변화
  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
    if (
      peerConnection.connectionState === 'disconnected' ||
      peerConnection.connectionState === 'closed'
    ) {
      console.log(`Disconnected or closed`);
    }
    if (
      peerConnection.connectionState === 'failed'
    ) {
      console.log(`Connection Failed`);
    }
  });

  // signaling 상태 변화
  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  // ICE connection 상태 변화
  peerConnection.addEventListener('iceconnectionstatechange', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`
    );
  });

  // dataChannel 에 대한 리스너 추가
  peerConnection.addEventListener('datachannel', (event) => {
    dataChannel = event.channel;

    console.log('data channel received!', dataChannel);
    dataChannel.addEventListener('open', dataChannelOpened);
    dataChannel.addEventListener('message', recieveFromPeer);
    dataChannel.addEventListener('close', dataChannelClosed);
  });
}

// ICE 할당 받아지면 Firebase Firestore에 저장
function collectIceCandidates(roomRef, peerConnection, localName, remoteName) {
  const candidatesCollection = roomRef.collection(localName);

  peerConnection.addEventListener('icecandidate', (event) => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    const json = event.candidate.toJSON();
    candidatesCollection.add(json).then((ref) => localICECandDocRefs.push(ref));

    console.log('Got candidate: ', event.candidate);
  });
}
