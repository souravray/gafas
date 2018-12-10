const RJSON = require('relaxed-json')
  , _ = require('lodash');

const parse = async(text, attempt=0) => {
  if(attempt>2) {
    return text;
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch(err) {
    throw err;
    try {
      json = RJSON.parse(text);
    } catch(err) { 
      throw err;
    }
  }
  if(_.isString(json)){
    try {
      attempt++
      return await parse(json, attempt);
    } catch(err) {
      throw err;
    }
  }
  return json;
}

module.exports = parse;
