import * as PIXI from 'pixi.js';

const Application = PIXI.Application,
    Texture = PIXI.Texture,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

const dungeon_texture = Texture.from('assets/img/dungeon.png');
const dungeon_size = 512;
const bunny_texture = Texture.from('assets/img/bunny.png');
const treasure_texture = Texture.from('assets/img/treasure.png');

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
  app.stage.addChild(bunny);

  let treasure = new Sprite(treasure_texture);
  treasure.x = app.screen.width - 100;
  treasure.y = app.screen.height / 2;

  app.stage.addChild(treasure);




function drawingMap() {
  for(let i=0; i<2; i++) {
    for(let j=0; j<1; j++) {
      let map = new Sprite(dungeon_texture);
      console.log(map.width);
      map.x = i * dungeon_size;
      map.y = j * dungeon_size;
      dungeons_container.addChild(map);
      dungeons.push(map);
    }
  }
}
