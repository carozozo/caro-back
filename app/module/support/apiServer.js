/* 實作 ck.Express 物件 for API Server */
class ApiServer extends ck.Express {
  static _addSlash (url) {
    return url.indexOf(`/`) === 0 ? url : `/${url}`
  }

  static _genRouteFn (genFn) {
    return async (req, res, next) => {
      try {
        await genFn(req, res, next)
      } catch (e) {
        next(e)
      }
    }
  }

  getGroupPath (group, version = require(`package.json`).version) {
    return `/api/v${version}/${group}`
  }

  createRouter (path = ``) {
    const router = super.createRouter(path)
    const methods = [`get`, `post`, `put`, `delete`]
    for (const method of methods) {
      const originalFn = router[method]
      router[method] = (...args) => {
        const lastArgIndex = args.length - 1
        args[0] = ApiServer._addSlash(args[0])
        args[lastArgIndex] = ApiServer._genRouteFn(args[lastArgIndex])
        originalFn.apply(router, args)
      }
    }
    return router
  }
}

module.exports = new ApiServer()
