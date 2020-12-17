'use strict';

import * as PIXI from 'pixi.js';

const Application = PIXI.Application,
    Texture = PIXI.Texture,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

const dungeon_texture = Texture.from('assets/img/dungeon.png');
const dungeon_size = 512;
const bunny_texture = Texture.from('assets/img/bunny.png');
const treasure_texture = Texture.from('assets/img/treasure.png');

let state;

let app = new Application({
  width: 1024,
  height: 512,
  antialias: true,
  view: document.querySelector('#scene')
});

  let dungeons_container = new Container();
  let dungeons = [];
  app.stage.addChild(dungeons_container);

  drawingMap();

  let bunny = new Sprite(bunny_texture);
  bunny.anchor.set(0.5); // default로 Sprite의 중심은 이미지의 좌측 상단이 된다. 이를 이미지 중심으로 변경해주는 작업이다.
  bunny.x = 100;
  bunny.y = 100;
  bunny.vx = 0;
  bunny.vy = 0;
  app.stage.addChild(bunny);

  let treasure = new Sprite(treasure_texture);
  treasure.x = app.screen.width - 100;
  treasure.y = app.screen.height / 2;

  app.stage.addChild(treasure);

  // 여기서부터 움직이는 기능
  state = play;
  let delta = 1;
  app.ticker.add(delta => gameLoop(delta));

  let keyObject = keyboard(keyValue);

// 맵 그리기..
function drawingMap() {
  for(let i=0; i<2; i++) {
    for(let j=0; j<1; j++) {
      let map = new Sprite(dungeon_texture);
      map.x = i * dungeon_size;
      map.y = j * dungeon_size;
      dungeons_container.addChild(map);
      dungeons.push(map);
    }
  }
}

// 주인공 움직이기
function gameLoop(delta) {
  state(delta);
}

function play(delta) {
    bunny.x += bunny.vx;
    bunny.y += bunny.vy;
}
