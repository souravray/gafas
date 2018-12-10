const _window = require('./window')
  , Events = require('events')
  , _ = require('lodash');

const defaultLayout = {
  fullscreen: true
  , stretch: true
  , marks: {}
  , hAlign: 'left'
  , vAlign: 'top'
}

class Scrollable extends Events {

  constructor(_events, _content, _startIndex, _layout, _cb) {
    super();
    if(!_events) {
      throw Error('A Scrollable contsiner cannot be initialized without keyboarrd event emmiter');
    }
    this.scrollEvents = _events;
    this.windowHeight = _window.maxBounds().height;
    this.updatecount = 0;
    this.updateContent(_content, _startIndex, _layout);
    this.registerEvents();
  }

  updateContent(_content, _startIndex, _layout, _cb) {
    this.updatecount++;
    this.layout = _layout || defaultLayout;
    this.content = _content || [];
    this.contentLength =!!_content? _content.length:0;
    this.startIndex = _startIndex || 0;
    this.canScrollDown = false;
    this.canScrollUp = false;
    this.pageCB = _cb || (()=>{});
    this._scroll();
  }

  _calculateScroll() {
    if(this.contentLength <= this.windowHeight){
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

  onScroll(_fnc){
    this.on('render', _.debounce(_fnc,50));
  }

  registerEvents() {
    const self=this;
    if(!this.setListnets) {
      this.scrollEvents.on('scroll_up', () => { self._scrollUp() });
      this.scrollEvents.on('scroll_down', () => { self._scrollDown() });
      this.scrollEvents.on('scroll_up_fast', () => { self._scrollUpFast() });
      this.scrollEvents.on('scroll_down_fast', () => { self._scrollDownFast() });
      this.setListnets = true;
    }
  }

  deregisterEvents() {
    const self=this;
    if(!!this.setListnets) {
      this.scrollEvents.removeAllListeners('scroll_up');
      this.scrollEvents.removeAllListeners('scroll_down');
      this.scrollEvents.removeAllListeners('scroll_up_fast');
      this.scrollEvents.removeAllListeners('scroll_down_fast');
      this.removeAllListeners('scrolled');
      this.setListnets = false;
    }
  }

  viewContent() {
    let endIndex = this.windowHeight + this.startIndex;
    let _content = this.content.slice(this.startIndex, endIndex);
    return _content.join('\n')
  }
}

module.exports = (kbEvents, content, index, layout) => new Scrollable(kbEvents, content, index, layout);
