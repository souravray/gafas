const chalk = require('chalk');

const stringFormater = (_jsonStr) => {
  return _jsonStr.split('\n')
          // .map( (c) => {
          //   return chalk.gray('░░ ') + chalk.bold(c);
          // });
}

const jsonFormater = (_json={}) => {
  return stringFormater(JSON.stringify(_json,null,3));
}

module.exports = jsonFormater;
