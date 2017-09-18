/* 提供 Cron Job 功能 */
class Cron {
  constructor (opt = {}) {
    this._cron = require(`node-cron`)
    this._jobMap = {}
    this._taskMap = {}
    this._timeZone = opt.timeZone
    this._befTaskRunHooks = [] // 每個 task 執行前的 hook
    this._aftTaskRunHooks = [] // 每個 task 執行後的 hook
  }

  regJob (description, ...args) {
    if (!description) throw Error(`請輸入 description`)
    if (this._jobMap[description]) throw Error(`Cron Job [${description}] 已被註冊`)
    const syntax = args[0]
    const fn = args[1]
    if (!this._cron.validate(syntax)) throw Error(`時間格式不正確`)
    if (!_.isFunction(fn)) throw Error(`請輸入要執行的 function`)
    this._jobMap[description] = args
  }

  run (cb) {
    for (const description in this._jobMap) {
      if (!this._jobMap.hasOwnProperty(description)) continue
      const args = this._jobMap[description]
      // 設置預設時區
      args[4] = args[4] || this._timeZone

      let argsForCb = _.clone(args)
      argsForCb.unshift(description)

      // 重新包裝要執行的 fn
      const fn = args[1]
      args[1] = async () => {
        for (const cb of this._befTaskRunHooks) {
          await cb.apply(null, argsForCb)
        }
        await fn.apply(null, argsForCb)
        for (const cb of this._aftTaskRunHooks) {
          await cb.apply(null, argsForCb)
        }
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
    this._befTaskRunHooks.push(cb)
    return this
  }
}

module.exports = Cron
