const chalk = require('chalk');

const stringFormater = (_jsonStr) => {
  return _jsonStr.split('\n');
}

const jsonFormater = (_json={}) => {
  return stringFormater(JSON.stringify(_json,null,3));
}

module.exports = jsonFormater;
