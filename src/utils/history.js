class History extends Map {
  constructor(_size) {
    super();
    this._maxSize = _size || 10;
    this._index = [];
  }

  add(key, value){
    if(this.has(key)) {
      const _lastPosition = this._cursor();
      this._moveToKey(key);
      return _lastPosition != this._cursor();
    }
    this.set(key, value);
    this._addToIndex(key);
    this._moveToKey(key);
    return true;
  }

  _addToIndex(key) {
    while(this._index.length >= this._maxSize) {
      this.delete(this._index.pop())
    }
    this._index.unshift(key);
  }

  _cursor() {
    if(this._index.length > 0) {
      this._cursorPosition = this._cursorPosition || 0;
      return this._cursorPosition;
    }
    return -1;
  }

  _moveToKey(key) {
    const _indexPosition = this._index.indexOf(key);
    if(_indexPosition >= 0) {
      this._cursorPosition = _indexPosition;
    }
  }

  _moveToPosition(_indexPosition) {
    if(_indexPosition >= 0) {
      this._cursorPosition = _indexPosition;
    }
  }

  current() {
    if(this._cursor() >= 0) {
      const _positionKey = this._index[this._cursor()];
      return this.get(_positionKey)
    }
    return;
  }

  next() {
    if(this._cursor() >= 0
      && this._cursor() < this._index.length-1) {
      this._cursorPosition++;
    }
    return this.current();
  }

  previous() {
    if(this._cursor() > 0) {
      this._cursorPosition--;
    }
    return this.current();
  }

  first() {
    if(this._cursor() > 0) {
      this._moveToPosition(0);
    }
    return this.current();
  }

  last() {
    if(this._cursor() < this._index.length-1) {
      this._moveToPosition(this._index.length-1);
    }
    return this.current();
  }
}

module.exports = (_size) => new History(_size);
