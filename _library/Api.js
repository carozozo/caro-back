class Api {
  constructor () {
    const express = require(`express`)
    this.port = null
    this.express = express
    this.app = express()
    this._hookMap = {}
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

  use (...args) {
    this.app.use.apply(this.app, args)
    return this
  }

  createRouter (path = ``) {
    const router = this.express.Router()
    this.app.use(path, router)
    return router
  }

  listen (port = 80) {
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
