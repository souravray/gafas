const clone = require('lodash/clone');
const leftMargin = 8;
module.exports = Base => class Wrappable extends Base {
  constructor(options) {
    super(options);
    this._windowWidth = options.window.width;
    this._shouldWrap = true;
  }

  resize(height, width) {
    if(typeof super.resize === 'function') {
      super.resize(height, width);
    }
    this._windowWidth = width;
    this._wrap();
  }

  updateContent(_content, _startIndex, _layout, _wrap, _margin, _cb) {
    if(typeof super.updateContent === 'function') {
      super.updateContent(_content, _startIndex, _layout, _cb);
    }
    this._shouldWrap = (_wrap === undefined) ? true : _wrap;
    this._unwrappedContent = clone(_content);
    this._wrap();
  }

  _wrap() {
    if(this._shouldWrap) {
      const _width = this._windowWidth - leftMargin || 30
      , _content = clone(this._unwrappedContent) || []
      , indRgx = /^\s*/i
      , lastSptrRgx = /[\s\/\\-_]+[^\s\/\\-_]{1,6}$/i
      , _wrappedContent = new Array();
      
      _content.forEach( _line => {
        const _baseInd =((_s)=>!!_s?_s[0]:'')(_line.match(indRgx))
        , _childInd = ' ' + _baseInd
        , _baseIndLen = _baseInd.length
        , _childIndLen = _childInd.length;

        let _isFirstLine = true;
        _line = _line.trim();

        while(_line.length > 0) {
          let _lineLen = _isFirstLine ? (_width - _baseIndLen) : (_width - _childIndLen)
            , _ind = _isFirstLine ? _baseInd :  _childInd
            , _newLine = _line.slice(0, _lineLen)
            , _stubSize = ((_s)=>!!_s?_s[0].length:0)(_newLine.match(lastSptrRgx));

          if(_stubSize>0) {
            _lineLen -= _stubSize;
            _newLine = _line.slice(0, _lineLen);
          }
          // reduce line
          _line = (_lineLen<_line.length)? _line.slice(_lineLen, _line.length) : '';
          _wrappedContent.push(_ind + _newLine.trim());
          _isFirstLine = false;
        }
      })
      this.content = _wrappedContent
    }
  }
}