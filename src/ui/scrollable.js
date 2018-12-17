const Events = require('events');

module.exports = Base => class Scrollable extends Base {
  constructor(options) {
    super(options);
    if(!(this instanceof Events)){
      throw Error('Scrollable object should be an istance of event');
    }

    this.scrollEvents = options.events;
    this.windowHeight = options.window.maxBounds().height;

  }

  resize(height, width) {
    if(typeof super.resize === 'function') {
      super.resize(height, width);
    }
    this.windowHeight = height;
    this. _calculateScroll();
    this._scroll();
  }

  updateContent(_content, _startIndex, _layout, _cb) {
    if(typeof super.updateContent === 'function') {
      super.updateContent(_content, _startIndex, _layout, _cb);
    }
    this.contentLength =!!_content? _content.length:0;
    this.startIndex = _startIndex || 0;
    this.canScrollDown = false;
    this.canScrollUp = false;
    this._scroll();
  }

  viewContent() {
    if(typeof super.viewContent === 'function') {
      super.viewContent();
    }
    let _content = this.content || [];
    let endIndex = this.windowHeight + this.startIndex;
    _content = _content.slice(this.startIndex, endIndex);
    return _content.join('\n')
  }

  registerEvents() {
    if(typeof super.registerEvents === 'function') {
      super.registerEvents();
    }
    const self=this;
    if(!this.setScrollListnets) {
      this.scrollEvents.on('scroll_up', () => { self._scrollUp() });
      this.scrollEvents.on('scroll_down', () => { self._scrollDown() });
      this.scrollEvents.on('scroll_up_fast', () => { self._scrollUpFast() });
      this.scrollEvents.on('scroll_down_fast', () => { self._scrollDownFast() });
      this.setScrollListnets = true;
    }
  }

  deregisterEvents() {
    if(typeof super.deregisterEvents === 'function') {
      super.deregisterEvents();
    }
    const self=this;
    if(!!this.setScrollListnets) {
      this.scrollEvents.removeAllListeners('scroll_up');
      this.scrollEvents.removeAllListeners('scroll_down');
      this.scrollEvents.removeAllListeners('scroll_up_fast');
      this.scrollEvents.removeAllListeners('scroll_down_fast');
      this.setScrollListnets = false;
    }
  }

  /* Scroll functions */
  _calculateScroll() {
    if(this.contentLength <= this.windowHeight){
      this.startIndex = 0;
      this.canScrollDown = false;
      this.canScrollUp = false;
      return;
    }
    
    this.canScrollDown = (this.contentLength-this.startIndex) > this.windowHeight;
    this.canScrollUp = this.startIndex > 0;
  }

  _scroll(){
    this._calculateScroll();
    this.emit('render');
  }

  _scrollUp() {
    if(this.canScrollUp) {
      this.startIndex--;
      this._scroll();
    }
  }

  _scrollDown() {
    if(this.canScrollDown) {
      this.startIndex++;
      this._scroll();
    }
  }

  _scrollUpFast() {
    if(this.canScrollUp) {
      let moveBy = this.startIndex > 3 ? 3 : this.startIndex;
      this.startIndex -= moveBy;
      this._scroll();
    }
  }

  _scrollDownFast() {
    if(this.canScrollDown) {
      let moveLeft = this.windowHeight - this.startIndex;
      let moveBy = (moveLeft > 3) ? 3 : moveLeft;
      this.startIndex += moveBy;
      this._scroll();
    }
  }
}
