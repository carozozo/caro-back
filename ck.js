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

  require (p, opt = {}) {
    const path = require(`path`)
    const load = opt.load // require 之後放入 ck
    opt._errCount = opt._errCount || 0 // 計數載入錯誤次數

    p = this._parseRequirePath(p)

    try {
      const filename = path.basename(p).replace(path.extname(p), ``)
      const modelName = _.replaceAll(filename, `.`, `_`)
      if (load) {
        if (this[modelName]) {
          console.error(`model ${modelName} 已被佔用`)
          return
        }
        this[filename] = require(p)
      }
      else return require(p)
    } catch (e) {
      if (++opt._errCount > 100) throw Error(`載入 ${p} 失敗 - ${e}`)
      setTimeout(() => this.require(p, opt), 1)
    }
  }

  requireDir (fileOrDirPath, opt = {}) {
    const fs = require(`fs`)
    const path = require(`path`)
    // 讀取的資料夾層數, 0 = 不設限
    const level = opt.level || opt.level === 0 ? parseInt(opt.level, 10) : 1 
    let fileCount = 0

    const requireFile = (fileOrDir, currentLevel = 0) => {
      const stat = fs.statSync(fileOrDir)
      if (stat.isFile() && fileOrDir.endsWith(`.js`)) {
        this.require(fileOrDir, opt)
        fileCount++
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
    return fileCount
  }
}

module.exports = CaroBack
