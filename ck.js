const _ = require(`caro`)

class CaroBack {
  constructor (opt = {}) {
    const isWriteLog = opt.isWriteLog
    const logDir = opt.logDir || `${__dirname}/logs`
    this._modelMap = {}
    this._isWriteLog = isWriteLog
    this._logDir = logDir
    this._isLogDirExists = false
    this._hookMap = {}
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

  // 取得呼叫 ck.js 的路徑
  _getLogCallerPath () {
    const stackList = new Error().stack.split(`\n`).splice(4) // 前 4 個是 ck 自己呼叫
    // 取出呼叫 ck log 的檔案路徑
    // stackList[0] 可能的格式1: `     at {呼叫者路徑}`
    // stackList[0] 可能的格式2: `     at xxx.js ({呼叫者路徑})`
    const callerPath = stackList[0].replace(/\s*at.*\(+(.*)\)+/i, `$1`)
    return callerPath.replace(process.env.PWD, ``)
  }

  _toString (data) {
    if (_.isString(data)) return data
    if (_.isError(data)) return `${data.message}\n${data.stack}`
    return JSON.stringify(data, null, 2)
  }

  _initLog (logName, args) {
    const path = this._getLogCallerPath()
    args.unshift(`(${path})`)

    logName = _.padEnd(`${logName}:`, 6)
    args.unshift(`${logName} [${this._getDate()} ${this._getTime()}]`)
  }

  _getFilesizeInBytes (filePath) {
    const fs = require(`fs`)
    if (!fs.existsSync(filePath)) return 0
    const stats = fs.statSync(filePath)
    return stats.size
  }

  _writeLog (logType, args) {
    if (!this._isWriteLog) return
    const fs = require(`fs`)
    const dirPath = this._logDir
    const mainLogPath = `${dirPath}/${this._getDate()}.log`
    const logPath = `${dirPath}/${this._getDate()}-${logType}.log`
    for (const i in args) {
      const d = args[i]
      args[i] = this._toString(d)
    }
    const data = args.join(` `)
    const dataStr = `${data}\n`
    const encode = `utf-8`
    if (!this._isLogDirExists) {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      this._isLogDirExists = true
    }
    fs.appendFile(mainLogPath, dataStr, encode, () => {
      fs.appendFile(logPath, dataStr, encode, () => {})
    })
  }

  ifWriteLog (isWriteLog = true) {
    this._isWriteLog = isWriteLog
  }

  // 只用在寫入 debug log, 不顯示在 console
  debug (...args) {
    const name = `debug`
    this._initLog(name, args)
    this._writeLog(name, args)
  }

  // 只顯示在 console, 不寫入 log
  info (...args) {
    const name = `info`
    this._initLog(name, args)
    args.unshift(`\x1b[36m%s\x1b[0m`)
    console.log.apply(null, args)
  }

  err (...args) {
    const name = `err`
    this._initLog(name, args)
    this._writeLog(name, args)
    args.unshift(`\x1b[31m%s\x1b[0m`)
    console.error.apply(null, args)
  }

  log (...args) {
    const name = `log`
    this._initLog(name, args)
    this._writeLog(name, args)
    args.unshift(`\x1b[32m%s\x1b[0m`)
    console.log.apply(null, args)
  }

  trace (...args) {
    const name = `trace`
    this._initLog(name, args)
    this._writeLog(name, args)
    args.unshift(`\x1b[35m%s\x1b[0m`)
    console.trace.apply(null, args)
  }

  require (p, opt = {}) {
    const path = require(`path`)
    const skip = opt.skip // require 之後不要放入 ck
    this.require.count = this.require.count || 0
    try {
      const filename = path.basename(p).replace(path.extname(p), ``)
      const modelName = _.replaceAll(filename, `.`, `_`)
      if (this[modelName]) return this.err(`model ${modelName} 已被佔用`)
      if (!skip) this[filename] = require(p)
      else require(p)
    } catch (e) {
      if (++this.require.count > 100) return this.err(`載入 ${p} 失敗`, e)
      setTimeout(() => this.require(p), 1)
    }
  }

  requireDir (fileOrDirPath, opt) {
    const fs = require(`fs`)
    const path = require(`path`)
    let fileCount = 0
    const requireFile = (fileOrDir) => {
      fileOrDir = path.relative(`./`, fileOrDir)
      const stat = fs.statSync(fileOrDir)
      if (stat.isFile() && fileOrDir.endsWith(`.js`)) {
        this.require(fileOrDir, opt)
        fileCount++
      }
      if (stat.isDirectory()) {
        const fileArr = fs.readdirSync(fileOrDir)
        _.forEach(fileArr, (file) => {
          const filePath = path.join(fileOrDir, file)
          requireFile(filePath)
        })
      }
    }
    requireFile(fileOrDirPath)
    return fileCount
  }
}

module.exports = CaroBack
