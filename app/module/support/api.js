/* 實作 ck.Express 物件 for API Server */
class Api extends ck.Express {
  getGroupPath (group, version = require(`package.json`).version) {
    return `/api/v${version}/${group}`
  }

  genRouteFn (genFn) {
    return async (req, res, next) => {
      try {
        await genFn(req, res, next)
      } catch (e) {
        next(e)
      }
    }
  }
}

module.exports = new Api()
