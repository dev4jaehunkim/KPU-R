import { UserInputWithSync } from '../keyboard.js'

export function convertUserInputTo5bitNumber(input) {
  let n=0;
  switch(input.xDirection) {
    case 5:
      n += 1;
      break;
    case -5:
      n += (1 << 1) + 1;
      break;
  }
  switch(input.yDirection) {
    case 5:
      n += 1 << 2;
      break;
    case -5:
      n += (1 << 3) + (1 << 2);
      break;
  }
  return n;
}

export function convert5bitNumberToUserInput(n) {
  const input = new UserInputWithSync(0,0);
  switch (n % (1 << 2)) {
    case 0:
      input.xDirection = 0;
      break;
    case 1:
      input.xDirection = 1;
      break;
    case 3:
      input.xDirection = -1;
      break;
  }
  switch ((n >>> 2) % (1 << 2)) {
    case 0:
      input.yDirection = 0;
      break;
    case 1:
      input.yDirection = 1;
      break;
    case 3:
      input.yDirection = -1;
      break;
  }
  return input;
}
