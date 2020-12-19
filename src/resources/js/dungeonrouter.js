/*
*
*   Game Play Code
*
*/

'use strict';
import { GameKeyboard, UserInputWithSync } from './keyboard.js'
import { init, getReceivedInput, sendInputQueueToPeer } from './webrtc/data_channel.js'

// PIXI 간편 변수들
const Application = PIXI.Application,
      Container   = PIXI.Container,
      Sprite      = PIXI.Sprite,
      Loader      = PIXI.loader;

export class DungeonRouter {
  constructor(app, resources) {
    // 키보드 입력 키 설정
    this.keyboardArray = [
      new GameKeyboard('ArrowLeft','ArrowUp','ArrowRight','ArrowDown'),
      new GameKeyboard('a','w','d','s'),
    ];

    this.amiPlayer2=false;

    // webrtc 세팅...
    init(this);

    // 기반 화면
    this.game_scene = new Container();
    app.stage.addChild(this.game_scene);

    // 맵 그리기
    let dungeon_size  = 512;
    let game_map = new Container();
    this.game_scene.addChild(game_map);

    for(let i=0; i<2; i++) {
      for(let j=0; j<1; j++) {
        let map = new Sprite(resources.dungeon.texture);
        map.x = i * dungeon_size;
        map.y = j * dungeon_size;
        game_map.addChild(map);
      }
    }

    // 캐릭터 그리기
    this.bunny = new Sprite(resources.bunny.texture);
    this.bunny.anchor.set(0.5); // default로 Sprite의 중심은 이미지의 좌측 상단이 된다. 이를 이미지 중심으로 변경해주는 작업이다.
    this.bunny.x  = 100;
    this.bunny.y  = 100;
    this.game_scene.addChild(this.bunny);

    // 캐릭터2 그리기
    this.bunny2 = new Sprite(resources.bunny.texture);
    this.bunny2.anchor.set(0.5); // default로 Sprite의 중심은 이미지의 좌측 상단이 된다. 이를 이미지 중심으로 변경해주는 작업이다.
    this.bunny2.x  = 900;
    this.bunny2.y  = 400;
    this.game_scene.addChild(this.bunny2);

    // 보물상자 그리기
    this.treasure = new Sprite(resources.treasure.texture);
    this.treasure.x = app.screen.width - 100;
    this.treasure.y = app.screen.height / 2;
    this.game_scene.addChild(this.treasure);

    // 키보드 세팅
    this.keyboardArray[0].getInput();
    this.keyboardArray[1].getInput();

    // 게임 시작 상태로 변경
    this.state = this.play;
  }

  // 맵 그리기 함수...
  drawingMap() {
    let dungeon_size  = 512;
    let game_map = new Container();
    this.game_scene.addChild(game_map);

    for(let i=0; i<2; i++) {
      for(let j=0; j<1; j++) {
        let map = new Sprite(this.resources.dungeon.texture);
        map.x = i * dungeon_size;
        map.y = j * dungeon_size;
        game_map.addChild(map);
      }
    }
  }

  gameLoop() {
    this.state(); // 게임의 현재 상태 변경
  }

  // 게임 play 모드
  play() {
    const userInputWithSync = new UserInputWithSync(
      this.keyboardArray[0].xDirection,
      this.keyboardArray[0].yDirection
    );
    sendInputQueueToPeer(userInputWithSync);

    if(this.amiPlayer2){
      this.bunny2.x += this.keyboardArray[0].xDirection;
      this.bunny2.y += this.keyboardArray[0].yDirection;

      this.bunny.x += getReceivedInput()[0] * 5;
      this.bunny.y += getReceivedInput()[1] * 5;
    } else {
      this.bunny.x += this.keyboardArray[0].xDirection;
      this.bunny.y += this.keyboardArray[0].yDirection;

      this.bunny2.x += getReceivedInput()[0] * 5;
      this.bunny2.y += getReceivedInput()[1] * 5;
    }
  }
}
