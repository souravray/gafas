const crypto = require('crypto');

module.exports.generate = (_content) => {
  const md5 = crypto.createHash('md5');
  return md5.update(_content).digest("base64");
};
