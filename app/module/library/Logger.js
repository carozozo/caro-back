/* 提供客製化 log 服務 */
class Logger {
  constructor ({cb}) {
    this._cb = cb
  }

  _padTime (d, length = 2) {
    return _.padStart(d, length, `0`)
  }

  _getDate () {
    const date = new Date()
    const y = date.getFullYear()
    const m = this._padTime(date.getMonth() + 1)
    const d = this._padTime(date.getDate())
    return [y, m, d].join(`-`)
  }

  _getTime () {
    const date = new Date()
    const h = this._padTime(date.getUTCHours())
    const i = this._padTime(date.getMinutes())
    const s = this._padTime(date.getSeconds()) + `.` + _.padEnd(date.getMilliseconds(), 3, `0`)
    return [h, i, s].join(`:`)
  }

  // 取得呼叫的路徑
  _getLogCallerPath () {
    const prepareStackTrace = Error.prepareStackTrace
    try {
      const err = new Error()
      let callerFile
      let currentFile

      Error.prepareStackTrace = (err, stack) => stack

      currentFile = err.stack.shift().getFileName()

      while (err.stack.length) {
        callerFile = err.stack.shift()
        const callerFileName = callerFile.getFileName()
        const callerFileLine = callerFile.getLineNumber()
        const callerFileColumn = callerFile.getColumnNumber()

        if (currentFile !== callerFileName) {
          Error.prepareStackTrace = prepareStackTrace
          const filename = callerFileName.replace(process.env.PWD, ``)
          return `${filename}:${callerFileLine}:${callerFileColumn}`
        }
      }
    } catch (err) {
      // 跳過
    }
    Error.prepareStackTrace = prepareStackTrace
    return ``
  }

  _getLogInfo (args) {
    return {
      path: this._getLogCallerPath(),
      time: `${this._getDate()} ${this._getTime()}`,
      args,
    }
  }

  _initArgs (type, logInfo) {
    type = _.padEnd(`${type}:`, 6)

    const path = logInfo.path
    const time = logInfo.time
    const args = logInfo.args

    const ret = [`${type}[${time}] (${path})`]
    ret.push(...args)
    return ret
  }

  _callLog (type, args) {
    const logInfo = this._getLogInfo(args)

    logInfo.type = type
    args = this._initArgs(type, logInfo)

    if (type === `log`) {
      args.unshift(`\x1b[32m%s\x1b[0m`)
      console.log.apply(null, args)
    } else if (type === `err`) {
      args.unshift(`\x1b[31m%s\x1b[0m`)
      console.error.apply(null, args)
    }

    this._cb && this._cb(type, logInfo.path, logInfo.args)
  }

  err (...args) {
    const type = `err`
    this._callLog(type, args)
  }

  log (...args) {
    const type = `log`
    this._callLog(type, args)
  }
}

module.exports = Logger