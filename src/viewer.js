const CliUpdate = require("cli-update")
  , CliBox = require("cli-box")
  , chalk = require('chalk')
  , figlet = require("figlet")
  , _ = require("lodash");

const { kbEvents, Scrollable} = require('./ui');

module.exports = (() => {
  const _container = Scrollable(kbEvents);

  const render = () => {
    CliUpdate.render(
      CliBox( _container.layout
        , _container.viewContent()
      )
    );
    _container.pageCB();
  }

  const loadPage = async (_pageMethod, ...args) => {
    if(_.isFunction(_pageMethod)) {
      const page = await _pageMethod(...args);
      if(!!page) {
        _container.updateContent(page.content, 0, page.layout, page.callback) 
      }
    }
  }

  _container.onScroll(render);

  return {
    loadPage,
    updateContent: (...args) => _container.updateContent(...args),
    pages: require('./pages'),
    keyboardEvents: kbEvents
  }
})();