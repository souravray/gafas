const isWin = require("is-win")
  , Events = require('events');

class WindowEvents extends Events {
  constructor() {
    super();
    const self = this;
    process.stdout.on('resize', () => {
      self.emit('window_resize');
    })
  }
}

module.exports.events = new WindowEvents();

module.exports.maxBounds = () => {
  let height = process.stdout.rows - 3
    , width = process.stdout.columns;
  // Compensate for Windows bug, see node-cli-update/issue #4
  if (isWin()) {
    width -= 1;
  }
  return { height, width };
}

module.exports.maxSize = () => {
  const size = exports.maxBounds();
  if(size.height < 12 || size.width < 32) {
    return 'xsmall';
  } else if(size.width < 48) {
    return 'small';
  } else if(size.width < 96) {
    return 'medium';
  } 
  
  return 'large';
}
