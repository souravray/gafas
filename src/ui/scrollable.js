const Events = require('events');

module.exports = Base => class Scrollable extends Base {
  constructor(options) {
    super(options);
    if(!(this instanceof Events)){
      throw Error('Scrollable object should be an istance of event');
    }

    this._scrollEvents = options.events;
    this._windowHeight = options.window.height;
  }

  resize(height, width) {
    if(typeof super.resize === 'function') {
      super.resize(height, width);
    }
    this._windowHeight = height;
    this._scroll();
  }

  updateContent(_content, _startIndex, _layout, _wrap, _margin, _cb) {
    if(typeof super.updateContent === 'function') {
      super.updateContent(_content, _startIndex, _layout, _wrap, _margin, _cb);
    }
    this._startIndex = _startIndex || 0;
    this._scroll();
  }

  viewContent() {
    if(typeof super.viewContent === 'function') {
      super.viewContent();
    }
    let _content = this.content || [];
    let _endIndex = this._windowHeight + this._startIndex;
    return _content.slice(this._startIndex, _endIndex);
  }

  registerEvents() {
    if(typeof super.registerEvents === 'function') {
      super.registerEvents();
    }
    const self=this;
    if(!this._setScrollListnets) {
      this._scrollEvents.on('scroll_up', () => { self._scrollUp() });
      this._scrollEvents.on('scroll_down', () => { self._scrollDown() });
      this._scrollEvents.on('scroll_up_fast', () => { self._scrollUpFast() });
      this._scrollEvents.on('scroll_down_fast', () => { self._scrollDownFast() });
      this._setScrollListnets = true;
    }
  }

  deregisterEvents() {
    if(typeof super.deregisterEvents === 'function') {
      super.deregisterEvents();
    }
    const self=this;
    if(!!this._setScrollListnets) {
      this._scrollEvents.removeAllListeners('scroll_up');
      this._scrollEvents.removeAllListeners('scroll_down');
      this._scrollEvents.removeAllListeners('scroll_up_fast');
      this._scrollEvents.removeAllListeners('scroll_down_fast');
      this._setScrollListnets = false;
    }
  }

  /* Scroll functions */
  _contentLength() {
    return !!this.content ? this.content.length : 0;
  }

  _canScrollDown() {
    return (this._contentLength() - this._startIndex) > this._windowHeight;
  }

  _canScrollUp() {
    return this._startIndex > 0;;
  }

  _scroll(){
    this.emit('render');
  }

  _scrollUp() {
    if(this._canScrollUp()) {
      this._startIndex--;
      this._scroll();
    }
  }

  _scrollDown() {
    if(this._canScrollDown()) {
      this._startIndex++;
      this._scroll();
    }
  }

  _scrollUpFast() {
    if(this._canScrollUp()) {
      let moveBy = this._startIndex > 3 ? 3 : this._startIndex;
      this._startIndex -= moveBy;
      this._scroll();
    }
  }

  _scrollDownFast() {
    if(this._canScrollDown()) {
      let moveLeft = this._windowHeight - this._startIndex;
      let moveBy = (moveLeft > 3) ? 3 : moveLeft;
      this._startIndex += moveBy;
      this._scroll();
    }
  }
}
