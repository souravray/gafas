const scanner = require('./src/scanner')
 , viewer = require('./src/viewer')
 , history  = scanner.history
 , pages = viewer.pages
 , kbEvents = viewer.keyboardEvents;

let scanStarted = false;

scanner.on('updated', () => {
  return viewer.updateContent(history.current());
})

kbEvents.on('go_to_next', () => {
  return viewer.updateContent(history.previous());
})

kbEvents.on('go_to_previous', () => {
  return viewer.updateContent(history.next());;
})

kbEvents.on('go_to_first', () => {
  return viewer.updateContent(history.first());
})

kbEvents.on('go_to_last', () => {
  return viewer.updateContent(history.last());;
})

kbEvents.on('toggle_scan', () => {
  if(scanStarted) {
    return scanner.pause();
  } 
  return scanner.start();
})

kbEvents.on('exit', () => {
  viewer.loadPage(pages.exit);
})

process.on('SIGINT', function() {
  viewer.loadPage(pages.exit);
})

process.on('SIGTERM', function() {
  viewer.loadPage(pages.exit);
})

viewer.loadPage(pages.welcome);
setTimeout(scanner.start, 1250);
