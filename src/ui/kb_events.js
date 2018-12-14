const Events = require('events')
  , keypress = require('keypress');

class KBEvents extends Events {
  constructor() {
    super();
    keypress(process.stdin);
    const self = this;
    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
      // scroll key evenets
      if (key && key.name === 'up') {
        self.emit('scroll_up');
      }

      if (key && key.name === 'down') {
        self.emit('scroll_down');
      }

      if (key && key.name === 'up' && key.shift) {
        self.emit('scroll_up_fast');
      }

      if (key && key.name === 'down' && key.shift) {
        self.emit('scroll_down_fast');
      }

      // history surf key evenets
      if (key && key.name === 'left') {
        self.emit('go_to_previous');
      }

      if (key && key.name === 'right') {
        self.emit('go_to_next');
      }

      if (key && key.name === 'left' && key.shift) {
        self.emit('go_to_last');
      }

      if (key && key.name === 'right' && key.shift) {
        self.emit('go_to_first');
      }

      // app controll key events
      if (key && (
            key.name === 'escape'
            || (key.name === 'c' && key.ctrl)
            || (key.name === 'z' && key.ctrl) 
        )){
        self.emit('exit');
      }

      if (key && key.ctrl && key.name === 'p'){
        self.emit('toggle_scan');
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
    keypress.enableMouse(process.stdout);
  }

  close() {
    keypress.disableMouse(process.stdout);
  }
}

module.exports = new KBEvents();
