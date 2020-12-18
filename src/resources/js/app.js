/*
*
*   Game Main Code
*
*/

'use strict';
import * as PIXI from 'pixi.js';
import { DungeonRouter } from './dungeonrouter.js'

// PIXI 간편 변수들
const Application = PIXI.Application,
      Container   = PIXI.Container,
      Sprite      = PIXI.Sprite,
      Loader      = PIXI.loader;

// 기본 application
let app = new Application({
  width: 1024,
  height: 512,
  antialias: true,
  view: document.querySelector('#scene')
});

// UI 그리기
setUpUI();

function setUpUI() {
  // 이미지 파일 미리 로드
  Loader
    .add('dungeon', 'assets/img/dungeon.png')
    .add('bunny', 'assets/img/bunny.png')
    .add('treasure', 'assets/img/treasure.png')
    .load(setup);
}

function setup() {
  const dungeonRouter = new DungeonRouter(app, Loader.resources);
  start(dungeonRouter);
}

function start(dungeonRouter) {
  // Looper 동작 60FPS
  app.ticker.add(() => {
    dungeonRouter.gameLoop();
  });
  app.ticker.start();
}
