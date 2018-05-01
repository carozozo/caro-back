const _ = require(`caro`)

class CaroBack {
  constructor () {
    this._modelMap = {}
    this._hookMap = {}
  }

  _getCallerPath () {
    const prepareStackTrace = Error.prepareStackTrace
    try {
      const err = new Error()
      Error.prepareStackTrace = prepareStackTrace
      let callerFile
      let currentFile

      Error.prepareStackTrace = (err, stack) => stack

      currentFile = err.stack.shift().getFileName()

      while (err.stack.length) {
        callerFile = err.stack.shift().getFileName()

        if (currentFile !== callerFile) {
          Error.prepareStackTrace = prepareStackTrace
          return callerFile
        }
      }
    } catch (err) {
      // 跳過
    }
    Error.prepareStackTrace = prepareStackTrace
    return ``
  }

  _parseRequirePath (p) {
    const path = require(`path`)
    if (p.startsWith(`./`) || p.startsWith(`../`)) {
      const callerPath = this._getCallerPath()
      const callerDir = path.dirname(callerPath)
      p = path.join(callerDir, p)
    }
    return p
  }

  setDebug (isDebug) {
    this._isDebug = isDebug
  }

  require (p, opt = {}) {
    const path = require(`path`)
    const load = opt.load // require 之後放入 ck

    p = this._parseRequirePath(p)

    try {
      const filename = path.basename(p).replace(path.extname(p), ``)
      const modelName = _.replaceAll(filename, `.`, `_`)
      if (this._isDebug) console.log(`modelName=`, modelName)

      if (load) {
        if (this[modelName]) {
          console.error(`model ${modelName} 已被佔用`)
          return
        }
        this[filename] = require(p)
        return this[filename]
      }
      else return require(p)
    } catch (e) {
      throw Error(`載入 ${p} 失敗 - ${e.stack}`)
    }
  }

  requireDir (fileOrDirPath, opt = {}) {
    const fs = require(`fs`)
    const path = require(`path`)
    // 讀取的資料夾層數, 0 = 不設限
    const level = opt.level || opt.level === 0 ? parseInt(opt.level, 10) : 1
    const ret = []

    const requireFile = (fileOrDir, currentLevel = 0) => {
      if (this._isDebug) console.log(`fileOrDir = ${fileOrDir}, currentLevel = ${currentLevel}`)

      const stat = fs.statSync(fileOrDir)
      if (stat.isFile() && fileOrDir.endsWith(`.js`)) {
        const module = this.require(fileOrDir, opt)
        ret.push({path: fileOrDir, module})
      }
      if (stat.isDirectory()) {
        currentLevel++ // 準備讀取下一層資料夾
        if (level && currentLevel > level) return
        const fileArr = fs.readdirSync(fileOrDir)
        _.forEach(fileArr, (file) => {
          const filePath = path.join(fileOrDir, file)
          requireFile(filePath, currentLevel)
        })
      }
    }

    fileOrDirPath = this._parseRequirePath(fileOrDirPath)

    if (!fs.existsSync(fileOrDirPath)) {
      throw Error(`路徑 ${fileOrDirPath} 不存在`)
    }

    const stat = fs.statSync(fileOrDirPath)
    if (!stat.isDirectory()) {
      throw Error(`路徑 ${fileOrDirPath} 必須為資料夾`)
    }

    requireFile(fileOrDirPath)
    return ret
  }
}

// 宣告 global
global._ = _
global.ck = new CaroBack()

// 戴入客制化 module
ck.requireDir(`app/module`, {level: 0, load: true})

module.exports = ck