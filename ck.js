const _ = require(`caro`)

class CaroBack {
  constructor () {
    this._modelMap = {}
    this._hookMap = {}
  }

  require (p, opt = {}) {
    const path = require(`path`)
    const skip = opt.skip // require 之後不要放入 ck
    this.require.count = this.require.count || 0
    try {
      const filename = path.basename(p).replace(path.extname(p), ``)
      const modelName = _.replaceAll(filename, `.`, `_`)
      if (!skip) {
        if (this[modelName]) return this.err(`model ${modelName} 已被佔用`)
        this[filename] = require(p)
      }
      else require(p)
    } catch (e) {
      if (++this.require.count > 100) return this.err(`載入 ${p} 失敗`, e)
      setTimeout(() => this.require(p), 1)
    }
  }

  autoRequire (fileOrDirPath, opt) {
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
