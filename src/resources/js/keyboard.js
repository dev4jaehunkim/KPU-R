/*
*
*   Keyboard Function Code
*
*/

'use strict';
import { key } from './key.js'

export class GameKeyboard {
  constructor(left, up, right, down) {
    this.left  = key(left),
    this.up    = key(up),
    this.right = key(right),
    this.down  = key(down);

    // 캐릭터 움직이는 값
    this.xDirection = 0;
    this.yDirection = 0;
    this.speed = 5;
  }

  // 키보드 입력 발생 시, direction 값 변경
  getInput() {
    // 왼쪽 버튼
    this.left.press = () => {
      this.xDirection = -this.speed;
    };
    this.left.release = () => {
      if(!this.right.isDown) this.xDirection = 0;
    };

    // 오른쪽 버튼
    this.right.press = () => {
      this.xDirection = this.speed;
    };
    this.right.release = () => {
      if(!this.left.isDown) this.xDirection = 0;
    }

    // 위쪽 버튼
    this.up.press = () => {
      this.yDirection = -this.speed;
    };
    this.up.release = () => {
      if(!this.down.isDown) this.yDirection = 0;
    }

    // 아래쪽 버튼
    this.down.press = () => {
      this.yDirection = this.speed;
    };
    this.down.release = () => {
      if(!this.up.isDown) this.yDirection = 0;
    }
  }
}
