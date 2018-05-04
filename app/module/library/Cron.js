/* 提供 node-cron 客製化操作服務 */
class Cron {
  constructor (opt = {}) {
    this._cron = require(`node-cron`)
    this._jobMap = {}
    this._taskMap = {}
    this._timeZone = opt.timeZone
    this._befTaskRunHooks = [] // 每個 task 執行前的 hook
    this._aftTaskRunHooks = [] // 每個 task 執行後的 hook
    this._onTaskingHooks = [] // 每個 task 執行時, 上個執行還未結束的 hook
  }

  async _runHooks (hooks, argsForCb) {
    for (const cb of hooks) {
      await cb.apply(null, argsForCb)
    }
  }

  regJob (description, ...args) {
    if (!description) throw Error(`請輸入 description`)
    if (this._jobMap[description]) throw Error(`Cron Job [${description}] 已被註冊`)
    const syntax = args[0]
    const fn = args[1]
    // startJobRightNow = args[2]
    // theCallbackWhenJobStop = args[3]
    // timezone = args[4]
    if (!this._cron.validate(syntax)) throw Error(`時間格式不正確`)
    if (!_.isFunction(fn)) throw Error(`請輸入要執行的 function`)
    this._jobMap[description] = args
  }

  run (cb) {
    for (const description in this._jobMap) {
      if (!this._jobMap.hasOwnProperty(description)) continue
      const args = this._jobMap[description]
      args[4] = args[4] || this._timeZone // 設置預設時區

      const argsForCb = _.clone(args)
      argsForCb.unshift(description)

      // 重新包裝要執行的 fn
      const fn = args[1]
      let isRunning = false
      args[1] = async () => {
        if (isRunning) { // 上個 task 還在執行中
          return await this._runHooks(this._onTaskingHooks, argsForCb)
        }

        isRunning = true
        try {
          await this._runHooks(this._befTaskRunHooks, argsForCb)

          const result = await fn()

          let argsForResultCb = _.clone(argsForCb)
          argsForResultCb.unshift(result)
          await this._runHooks(this._aftTaskRunHooks, argsForResultCb)
        } catch (e) {
          console.error(e)
          isRunning = false
        }
        isRunning = false
      }

      this._taskMap[description] = this._cron.schedule.apply(this._cron, args)
      cb && cb.apply(null, argsForCb)
    }
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
