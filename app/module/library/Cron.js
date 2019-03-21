/* 提供 node-cron 客製化操作服務 */
class Cron {
  constructor (opt = {}) {
    this._cron = require(`node-cron`)
    this._taskMap = {}
    this._opt = opt || {timezone: `Asia/Taipei`}
    this._onLoadTaskRunHooks = [] // 每個 task 載入時的 hook
    this._befTaskRunHooks = [] // 每個 task 執行前的 hook
    this._aftTaskRunHooks = [] // 每個 task 執行後的 hook
    this._onTaskingHooks = [] // 每個 task 執行時, 上個執行還未結束的 hook
  }

  static async _runHooks (hooks = [], cbParam) {
    for (const cb of hooks) {
      await cb(cbParam)
    }
  }

  // 註冊任務
  async regTask (description, ...args) {
    const taskName = args[0]
    const syntax = args[1]
    const fn = args[2]
    const opt = _.assign(this._opt, args[3])
    const isExecNow = args[4]

    if (!taskName) throw Error(`請輸入 taskName`)
    if (this._taskMap[taskName]) throw Error(`Cron Job [${taskName}] 已被註冊`)
    if (!this._cron.validate(syntax)) throw Error(`時間格式不正確`)
    if (!_.isFunction(fn)) throw Error(`請輸入要執行的 function`)

    this._taskMap[taskName] = {syntax, fn, opt}
    if (isExecNow) {
      const cbParam = {taskName, syntax}
      await Cron._runHooks(this._befTaskRunHooks, cbParam)
      await fn()
      await Cron._runHooks(this._aftTaskRunHooks, cbParam)
    }
  }

  // 把註冊的任務排到 schedule
  async schedule () {
    for (const taskName in this._taskMap) {
      if (!this._taskMap.hasOwnProperty(taskName)) continue

      const args = this._taskMap[taskName]
      const syntax = args.syntax
      const fn = args.fn
      const opt = args.opt
      const cbParam = {taskName, syntax}

      // 重新包裝要執行的 fn
      let isRunning = false
      const newFn = async () => {
        if (isRunning) { // 上個 task 還在執行中
          return await Cron._runHooks(this._onTaskingHooks, cbParam)
        }

        isRunning = true
        try {
          await Cron._runHooks(this._befTaskRunHooks, cbParam)
          await fn()
          await Cron._runHooks(this._aftTaskRunHooks, cbParam)
        } catch (e) {
          console.error(e)
          isRunning = false
        }
        isRunning = false
      }
      this._cron.schedule(syntax, newFn, opt)
      await Cron._runHooks(this._onLoadTaskRunHooks, cbParam)
    }
    return this
  }

  onLoadTask (cb) {
    this._onLoadTaskRunHooks.push(cb)
    return this
  }

  befTask (cb) {
    this._befTaskRunHooks.push(cb)
    return this
  }

  aftTask (cb) {
    this._aftTaskRunHooks.push(cb)
    return this
  }

  onTasking (cb) {
    this._onTaskingHooks.push(cb)
    return this
  }
}

module.exports = Cron
