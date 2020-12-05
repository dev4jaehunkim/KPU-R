import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: 720,
  height: 400,
  backgroundColor: 0x1099bb,
  view: document.querySelector('#scene')
});

const texture = PIXI.Texture.from('assets/img/bunny.png');
const bunny = new PIXI.Sprite(texture);
bunny.anchor.set(0.5);
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
app.stage.addChild(bunny);

app.ticker.add(() => {
    // just for fun, let's rotate mr rabbit a little
    bunny.rotation += 0.1;
});
