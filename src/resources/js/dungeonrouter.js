/*
*
*   Game Play Code
*
*/

import { keyboard } from './keyboard.js'

// PIXI 간편 변수들
const Application = PIXI.Application,
      Container   = PIXI.Container,
      Sprite      = PIXI.Sprite,
      Loader      = PIXI.loader;
// 키보드
let left  = keyboard("ArrowLeft"),
    up    = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down  = keyboard("ArrowDown");

export class DungeonRouter {
  constructor(app, resources) {

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
    this.bunny.vx = 0;
    this.bunny.vy = 0;
    this.game_scene.addChild(this.bunny);

    // 보물상자 그리기
    this.treasure = new Sprite(resources.treasure.texture);
    this.treasure.x = app.screen.width - 100;
    this.treasure.y = app.screen.height / 2;
    this.game_scene.addChild(this.treasure);

    // 키보드 세팅
    let speed = 5;
    this.setupKeyboard(speed);

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
    this.bunny.x += this.bunny.vx;
    this.bunny.y += this.bunny.vy;
  }

  setupKeyboard(speed) {
    // 왼쪽 버튼
    left.press = () => {
      this.bunny.vx = -speed;
    };
    left.release = () => {
      if(!right.isDown) this.bunny.vx = 0;
    };

    // 오른쪽 버튼
    right.press = () => {
      this.bunny.vx = speed;
    };
    right.release = () => {
      if(!left.isDown) this.bunny.vx = 0;
    }

    // 위쪽 버튼
    up.press = () => {
      this.bunny.vy = -speed;
    };
    up.release = () => {
      if(!down.isDown) this.bunny.vy = 0;
    }

    // 아래쪽 버튼
    down.press = () => {
      this.bunny.vy = speed;
    };
    down.release = () => {
      if(!up.isDown) this.bunny.vy = 0;
    }
  }
}
