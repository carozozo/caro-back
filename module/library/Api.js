/* 提供 express 客製化操作服務 */
class Api {
  constructor () {
    const express = require(`express`)
    this.port = null
    this.express = express
    this.app = express()
    this._hookMap = {}
    this._befRoutes = []
    this._onRoutes = []
    this._aftRoutes = []
  }

  _getHook (fnName) {
    const hookMap = this._hookMap
    const hook = hookMap[fnName] = hookMap[fnName] || {}
    hook.on = hook.on || {}
    return hook
  }

  async _triggerBy (triggerMethod, fnName, args) {
    const hook = this._getHook(fnName)
    const fns = hook[triggerMethod]
    for (const key in fns) {
      const fn = fns[key]
      await fn.apply(this, args)
    }
  }

  async _triggerByOn (fnName, args) {
    await this._triggerBy(`on`, fnName, args)
  }

  on (fnName, fn, bindName) {
    const hook = this._getHook(fnName)
    if (bindName) {
      hook.on[bindName] = fn
    } else {
      hook.on[_.size(hook.on)] = fn
    }
    return this
  }

  befRoute (...args) {
    this._befRoutes.push(() => {
      this.app.use.apply(this.app, args)
    })
    return this
  }

  aftRoute (...args) {
    this._aftRoutes.push(() => {
      this.app.use.apply(this.app, args)
    })
    return this
  }

  createRouter (path = ``) {
    const router = this.express.Router()
    this._onRoutes.push(() => {
      this.app.use(path, router)
    })
    return router
  }

  listen (port = 80) {
    _.forEach(this._befRoutes, (fn) => fn())
    _.forEach(this._onRoutes, (fn) => fn())
    _.forEach(this._aftRoutes, (fn) => fn())

    return new Promise((resolve, reject) => {
      let server = this.app.listen(port, () => {
        this.port = port
        resolve()
        this._triggerByOn(`listen`, [port])
      })
      server.on(`error`, (err) => {
        reject(err)
      })
    })
  }
}

module.exports = Api
