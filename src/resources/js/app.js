/*
*
*   Game Main Code
*
*/

'use strict';
import * as PIXI from 'pixi.js';
import { keyboard } from './keyboard.js'

// PIXI 간편 변수들
const Application = PIXI.Application,
      Container   = PIXI.Container,
      Sprite      = PIXI.Sprite,
      Loader      = PIXI.loader;

let left  = keyboard("ArrowLeft"),
    up    = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down  = keyboard("ArrowDown");

let state;

let game_scene,
    bunny,
    treasure;

// 기본 application
let app = new Application({
  width: 1024,
  height: 512,
  antialias: true,
  view: document.querySelector('#scene')
});

// UI 그리기
setUpUI();

// --------------------------------------------------
/*
*
*   Game Function Code
*
*/


function setUpUI() {
  // 이미지 파일 미리 로드
  Loader
    .add('dungeon', 'assets/img/dungeon.png')
    .add('bunny', 'assets/img/bunny.png')
    .add('treasure', 'assets/img/treasure.png')
    .load(setup);
}

function setup() {

  // 기반 화면
  game_scene = new Container();
  app.stage.addChild(game_scene);

  // 맵 그리기
  drawingMap(game_scene);

  // 캐릭터 그리기
  bunny = new Sprite(Loader.resources.bunny.texture);
  bunny.anchor.set(0.5); // default로 Sprite의 중심은 이미지의 좌측 상단이 된다. 이를 이미지 중심으로 변경해주는 작업이다.
  bunny.x  = 100;
  bunny.y  = 100;
  bunny.vx = 0;
  bunny.vy = 0;
  game_scene.addChild(bunny);

  // 보물상자 그리기
  treasure = new Sprite(Loader.resources.treasure.texture);
  treasure.x = app.screen.width - 100;
  treasure.y = app.screen.height / 2;
  game_scene.addChild(treasure);

  // 키보드 세팅
  let speed = 5;
  setupKeyboard(speed);

  // 게임 시작 상태로 변경
  state = play;

  // Looper 동작 60FPS
  app.ticker.add(delta => gameLoop(delta));
}

// 맵 그리기 함수...
function drawingMap(game) {
  const dungeon_size  = 512;

  let game_map = new Container();
  game.addChild(game_map);

  for(let i=0; i<2; i++) {
    for(let j=0; j<1; j++) {
      let map = new Sprite(Loader.resources.dungeon.texture);
      map.x = i * dungeon_size;
      map.y = j * dungeon_size;
      game_map.addChild(map);
    }
  }
}

function setupKeyboard(speed) {
  // 왼쪽 버튼
  left.press = () => {
    bunny.vx = -speed;
  };
  left.release = () => {
    if(!right.isDown) bunny.vx = 0;
  };

  // 오른쪽 버튼
  right.press = () => {
    bunny.vx = speed;
  };
  right.release = () => {
    if(!left.isDown) bunny.vx = 0;
  }

  // 위쪽 버튼
  up.press = () => {
    bunny.vy = -speed;
  };
  up.release = () => {
    if(!down.isDown) bunny.vy = 0;
  }

  // 아래쪽 버튼
  down.press = () => {
    bunny.vy = speed;
  };
  down.release = () => {
    if(!up.isDown) bunny.vy = 0;
  }
}

function gameLoop(delta) {
  // 게임의 현재 상태 변경
  state(delta);
}

function play(delta) {
    bunny.x += bunny.vx;
    bunny.y += bunny.vy;
}
