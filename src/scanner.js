const clipboardy = require('clipboardy')
  , _ = require('lodash')
  , { History, Hash } = require('./utils')
  , _JSON = require('./json')
  , Events = require('events');

class ScannerEvents extends Events {}

module.exports = (() => {
  let _history = History(50)
    , _isPaused = true
    , _scanD = null
    , _events = new ScannerEvents()
    , _lastRawHash;

  const _scan = () => {
    let hash;
    if(!_isPaused){
      clipboardy.read()
      .then(_raw => {
        const _rawHash = Hash.generate(_raw);
        if(_rawHash == _lastRawHash) {
          return;
        }
        _lastRawHash = _rawHash;
        return _JSON.parse(_raw);
      })
      .then(_json => {
        if(_.isUndefined(_json) 
          || _.isEmpty(_json)
          || _.isString(_json)){
          return;
        }
        hash = Hash.generate(JSON.stringify(_json));
        return _JSON.format(_json)
      })
      .then(_content => {
        if(!_.isUndefined(_content) 
          && !_.isEmpty(_content) 
          && _history.add(hash, _content)) {
          _events.emit('updated');
        }
        return;
      })
      .catch((err) => {})
      .finally(() => {
        _scanD = setTimeout(_scan, 750);
      })
    }
  }

  const start = () => {
    _isPaused = false;
    _scanD = setTimeout(_scan, 0);
  }

  const pause = () => {
    if(_scan!== null) {
      clearTimeout(_scanD);
    }
    _isPaused = true;
    _events.emit('paused');
  }

  return {
    start,
    pause,
    on: (...args) => _events.on(...args),
    history: {
      next: () => _history.next(),
      previous: () => _history.previous(),
      current: () => _history.current(),
      first: () => _history.first(),
      last: () => _history.last(),
    }
  }
})();
