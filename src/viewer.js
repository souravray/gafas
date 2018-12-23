const CliUpdate = require("cli-update")
  , CliBox = require("cli-box")
  , chalk = require('chalk')
  , figlet = require("figlet")
  , _ = require("lodash");

const { kbEvents, Container } = require('./ui');

module.exports = (() => {
  const _container = Container({ events: kbEvents });

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
        _container.updateContent(page.content, 0, page.layout, page.shouldWrapped, page.shouldMmargined, page.callback) 
      }
    }
  }

  const shutdown = () => {
    return _container.shuthown();
  }

  _container.onUpdate(render);

  return {
    loadPage,
    updateContent: (...args) => _container.updateContent(...args),
    shutdown,
    pages: require('./pages'),
    keyboardEvents: kbEvents
  }
})();
