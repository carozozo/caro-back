const _ = require(`caro`)

class CaroBack {
  constructor () {
    this._modelMap = {}
    this._hookMap = {}
  }

  _getCallerPath () {
    try {
      const err = new Error()
      let callerFile
      let currentFile

      Error.prepareStackTrace = (err, stack) => {return stack}

      currentFile = err.stack.shift().getFileName()

      while (err.stack.length) {
        callerFile = err.stack.shift().getFileName()

        if (currentFile !== callerFile) return callerFile
      }
    } catch (err) {
      // 跳過
    }
    return undefined
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
    const skip = opt.skip // require 之後不要放入 ck
    this.require.count = this.require.count || 0

    p = this._parseRequirePath(p)

    try {
      const filename = path.basename(p).replace(path.extname(p), ``)
      const modelName = _.replaceAll(filename, `.`, `_`)
      if (!skip) {
        if (this[modelName]) console.error(`model ${modelName} 已被佔用`)
        this[filename] = require(p)
      }
      else require(p)
    } catch (e) {
      if (++this.require.count > 100) throw Error(`載入 ${p} 失敗`, e)
      setTimeout(() => this.require(p), 1)
    }
  }

  autoRequire (fileOrDirPath, opt) {
    const fs = require(`fs`)
    const path = require(`path`)
    let fileCount = 0

    const requireFile = (fileOrDir) => {
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
