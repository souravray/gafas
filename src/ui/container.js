const Sourcable = require('./scrollable')
  ,  Wrappable = require('./wrappable')
  , { Mixin } = require('../utils')
  , Events = require('events')
  , _window = require('./window')
  , debounce = require('lodash/debounce')
  , chalk = require('chalk');

const defaultLayout = {
  fullscreen: true
  , stretch: true
  , marks: {}
  , hAlign: 'left'
  , vAlign: 'top'
};

class Container extends Mixin(Events).with(Sourcable, Wrappable) {
  constructor(options) {
    if(!options.events) {
      throw Error('A Container cannot be initialized without keyboarrd event emmiter');
    }

    Object.assign(options, { 
      window: _window.maxBounds()
    });
    super(options);
    this.updatecount = 0;
    this.windowEvents = _window.events;
    this.pageMargin = false;
    this.registerEvents();
    this.updateContent(options.content, options.startIndex, options.layout);
  }

  onUpdate(_fnc){
    // debunce time is consider for 2 frames time 
    // at 16 frames per sce refresh rate
    this.on('render', debounce(_fnc,125));
  }

  resize(_height, _width) {
    const height = _height || _window.maxBounds().height
      , width = _width || _window.maxBounds().width;

    if(typeof super.resize === 'function') {
      super.resize(height, width);
    }
  }

  updateContent(_content, _startIndex, _layout, _wrap, _margin, _cb) {
    this.updatecount++;
    this.layout = _layout || defaultLayout;
    this.content = _content || [];
    this.pageMargin = (_margin === undefined)? true : _margin;
    this.pageCB = _cb || (() => {});

    if(typeof super.updateContent === 'function') {
      super.updateContent(_content, _startIndex, _layout, _wrap, _margin, _cb);
    }
  }

  viewContent() {
    let _content = this.content;
    
    if(typeof super.viewContent === 'function') {
      _content = super.viewContent();
    }

    if(this.pageMargin) {
      return _content.map((c) => {
          return chalk.gray('░░ ') + chalk.bold(c);
        }).join('\n')
    }

    return _content.join('\n');
  }

  registerEvents() {
    const self=this;
    if(!this.setContainerListnets) {
      this.windowEvents.on('window_resize', debounce(() => self.resize(), 150));
      this.setContainerListnets = true;
    }

    if(typeof super.registerEvents === 'function') {
      super.registerEvents();
    }
  }

  deregisterEvents() {
    const self=this;
    if(!!this.setContainerListnets) {
      this.windowEvents.removeAllListeners('window_resize');
      this.removeAllListeners('render');
      this.setContainerListnets = false;
    }

    if(typeof super.deregisterEvents === 'function') {
      super.deregisterEvents();
    }
  }

  shuthown() {
    this.deregisterEvents();
    this.scrollEvents.close();
  }
}

module.exports = (options) => new Container(options);
