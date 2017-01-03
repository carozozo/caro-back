/* 客製化 mocha */
const originalDescribe = global.describe
const originalIt = global.it

global.describe = (title, fn) => {
  title = _.upperFirst(title)
  return originalDescribe(title, fn)
}
global.describe.only = (title, fn) => {
  title = _.upperFirst(title)
  return originalDescribe.only(title, fn)
}
global.describe.skip = (title, fn) => {
  title = _.upperFirst(title)
  return originalDescribe.skip(title, fn)
}
global.it = (title, fn) => {
  if (_.isFunction(title)) {
    fn = title
    title = ``
  }
  title = _.upperFirst(title)
  return originalIt(title, fn)
}
global.it.only = (title, fn) => {
  if (_.isFunction(title)) {
    fn = title
    title = ``
  }
  title = _.upperFirst(title)
  return originalIt.only(title, fn)
}
global.it.skip = (title, fn) => {
  if (_.isFunction(title)) {
    fn = title
    title = ``
  }
  title = _.upperFirst(title)
  return originalIt.skip(title, fn)
}
