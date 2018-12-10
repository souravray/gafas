const chalk = require('chalk')
  , figlet = require("figlet")
  , { _window } = require('../ui') 
  , logo = require('./logo');

const layout = {
            fullscreen: true
          , marks: {}
          , hAlign: 'center'
          , vAlign: 'middle'
        };

module.exports = () => {
  return new Promise((resolve, reject) => {
    const _logo = logo(_window.maxSize());
    figlet('Gafas', (err, _data) => {
      if(!!err){
        resolve(err);
      }

      let data = _data.split('\n')
        .map( c => chalk.greenBright(c))
        .join("\n");
      data = _logo + data + chalk.green('\n\n\nBeautiful JSON snippet viewer.\n\n¡Diviértete!');
      resolve({content: data.split('\n'), layout: layout});
    });
  });
}
