/* 提供註冊 functions 和 await 執行 */
class Stacker {
  constructor () {
    this._hookMap = {}
    this._fns = []
  }

  _getHook (fnName) {
    const hookMap = this._hookMap
    const hook = hookMap[fnName] = hookMap[fnName] || {}
    hook.on = hook.on || []
    return hook
  }

  async _triggerBy (triggerMethod, fnName, args) {
    const hook = this._getHook(fnName)
    const fns = hook[triggerMethod]
    for (const fn of fns) {
      await fn.apply(this, args)
    }
  }

  async _triggerByOn (fnName, args) {
    await this._triggerBy(`on`, fnName, args)
  }

  on (fnName, fn) {
    const hook = this._getHook(fnName)
    hook.on.push(fn)
    return this
  }

  regStack (fn) {
    this._fns.push(fn)
  }

  async runStacks () {
    const _fns = this._fns
    for (const fn of _fns) {
      await fn()
    }
    this._triggerByOn(`runStacks`)
  }
}

module.exports = Stacker
