function keyboard(value) {
  let key={};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  // downHandler
  key.downHandler = event => {
    if (event.key === key.value) {
      if(key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  // upHandler
  key.upHandler = event => {
    if(event.key === key.value) {
      if(key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  // attache event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventHandler(
    "keydown", downListener, false
  );
  window.addEventHandler(
    "keyUp", upListener, false
  );

  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;

}
