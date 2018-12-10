const path = require('path')
  , fs = require('fs')
  , chalk = require('chalk');

module.exports = (size) => {
  let  filePath;
  switch(size){
    case 'small':
      filePath = path.join(__dirname, './asset/logo.small.txt')
      break;
    case 'medium':
      filePath = path.join(__dirname, './asset/logo.medium.txt')
      break;
    case 'large':
      filePath = path.join(__dirname, './asset/logo.large.txt')
      break;
    case 'xsmall':
    default:
  }
  if(!!filePath) {
    return fs.readFileSync(filePath, 'utf8')
                .split('\n')
                .map( c => chalk.cyan(c))
                .join("\n")+'\n\n\n\n';
  }
  return '\n\n';
}