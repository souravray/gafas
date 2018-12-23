const chalk = require('chalk')
  , figlet = require("figlet")
  , { _window} = require('../ui');

module.exports = ( cb) => {
  return new Promise((resolve, reject) => {
    figlet('¡Adiós Amigo!', (err, _data) => {
      if(!!err){
        resolve(err);
      }
      let data = _data.split('\n')
        .map( c => chalk.blueBright(c))
        .join("\n");
      resolve ({
        content: data.split('\n'),
        layout: {
           w: _window.maxBounds().width
          , h: 10
          , marks: {}
        },
        callback: () => cb(),
        shouldWrapped: false,
        shouldMmargined: false
      })
    })
  })
}
