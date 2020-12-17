//Capture the keyboard arrow keys
let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

// left
left.press = () => {
  bunny.vx = -5;
  bunny.vy = 0;
}
left.release = () => {
  if(!right.isDown && bunny.vy == 0) {
    bunny.vx = 0;
  }
}

// right
right.press = () => {
  bunny.vx = 5;
  bunny.vy = 0;
}
right.release = () => {
  if(!left.isDown && bunny.vy == 0) {
    bunny.vx = 0;
  }
}

// up
up.press = () => {
  bunny.vx = 0;
  bunny.vy = -5;
}
up.release = () => {
  if(!down.isDown && bunny.vx == 0) {
    bunny.vy = 0;
  }
}

// down
down.press = () => {
  bunny.vx = 0;
  bunny.vy = 5;
}
down.release = () => {
  if(!left.isUp && bunny.vx == 0) {
    bunny.vy = 0;
  }
}
