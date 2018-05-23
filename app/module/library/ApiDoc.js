/* 提供建立 apidoc 文件自動化 */
class ApiDoc {
  constructor (docDir, defineDoc) {
    const fs = require(`fs`)

    if (!fs.existsSync(docDir)) throw Error(`docDir 資料夾不存在`)
    const stats = fs.statSync(docDir)
    if (!stats.isDirectory()) throw Error(`docDir 必須為資料夾`)

    this._docDir = docDir
    this._defineFile = `${this._docDir}/${defineDoc}`
    this._define = {}
    this._path = require(`path`)
    this._fs = require(`fs`)
  }

  _regDefine (name) {
    if (!name) throw Error(`請輸入 apiDefine 名稱`)
    if (this._define[name]) throw Error(`apiDefine ${name} 已定義`)
    this._define[name] = true
    return name
  }

  _toString (data) {
    if (_.isString(data)) return data
    if (_.isError(data)) return data.toString()
    return JSON.stringify(data, null, 2)
  }

  _ensureDirectoryExistence (filePath) {
    const dirPath = this._path.dirname(filePath)
    if (this._fs.existsSync(dirPath)) {
      return true
    }
    this._ensureDirectoryExistence(dirPath)
    this._fs.mkdirSync(dirPath)
  }

  _unlinkDirRecursively (filePath) {
    if (!this._fs.existsSync(filePath)) return

  }

  _write (filePath, data) {
    this._ensureDirectoryExistence(filePath)
    this._fs.appendFileSync(filePath, `${data}\n\n`, `utf8`)
  }

  _writeApiFile (group = ``, data) {
    this._write(`${this._docDir}/${group}Doc.js`, data)
  }

  _writeDefineFile (data) {
    this._write(this._defineFile, data)
  }

  genVersion (version) {
    return `@apiVersion ${version}`
  }

  genApi (opt) {
    if (!opt) return
    const path = opt.path || `-`
    let method = opt.method || ``
    let title = opt.title || ``
    method = method.toUpperCase()
    title = _.upperFirst(title)
    return `@api {${method}} ${path} ${title}`
  }

  genDescription (str) {
    if (!str) return
    str = _.upperFirst(str)
    return `@apiDescription ${str}`
  }

  genName (str) {
    if (!str) return
    str = _.upperFirst(str)
    return `@apiName ${str}`
  }

  genGroup (str) {
    if (!str) return
    str = _.upperFirst(str)
    return `@apiGroup ${str}`
  }

  genHeader (opt) {
    const field = opt.field
    let type = opt.type
    let desc = opt.desc
    type = _.upperFirst(type)
    desc = _.upperFirst(desc)
    return `@apiHeader (Header) {${type}} ${field} ${desc}`
  }

  genParam (opt) {
    const field = opt.field
    let group = `${opt.group ? _.upperFirst(opt.group) + ` ` : ``}Param`
    let type = opt.type
    let desc = opt.desc
    type = _.upperFirst(type)
    desc = _.upperFirst(desc)
    return `@apiParam (${group}) {${type}} ${field} ${desc}`
  }

  genParamExample (opt) {
    const data = opt.data
    const str = this._toString(data)
    let name = opt.name
    name = _.upperFirst(name)
    return `@apiParamExample ${name}\n${str}`
  }

  genSuccess (opt) {
    const data = opt.data
    const str = this._toString(data)
    let name = opt.name
    name = _.upperFirst(name)
    return `@apiSuccessExample ${name}\n${str}`
  }

  genError (opt) {
    const data = opt.data
    const str = this._toString(data)
    let name = opt.name
    name = _.upperFirst(name)
    return `@apiErrorExample ${name}\n${str}`
  }

  genDefine (opt) {
    const name = opt.name
    const data = opt.data
    this._regDefine(name)
    const str = this._toString(data)
    return `@apiDefine ${name}\n${str}`
  }

  genUse (name) {
    if (!name) return
    return `@apiUse ${name}`
  }

  outputApi (settingMap = {}) {
    const apiSampleRequestStr = `@apiSampleRequest off`
    const fnMap = {
      version: (setting) => {
        return this.genVersion(setting) + `\n`
      },
      api: (setting) => {
        return this.genApi(setting) + `\n`
      },
      description: (setting) => {
        return this.genDescription(setting) + `\n`
      },
      name: (setting) => {
        return this.genName(setting) + `\n`
      },
      group: (setting) => {
        return this.genGroup(setting) + `\n`
      },
      header: (settings) => {
        let str = ``
        for (const setting of settings) {
          str += this.genHeader(setting) + `\n`
        }
        return str
      },
      param: (settings) => {
        let str = ``
        for (const setting of settings) {
          str += this.genParam(setting) + `\n`
        }
        return str
      },
      paramExample: (settings) => {
        let str = ``
        for (const setting of settings) {
          str += this.genParamExample(setting) + `\n`
        }
        return str
      },
      success: (settings) => {
        let str = ``
        for (const setting of settings) {
          str += this.genSuccess(setting) + `\n`
        }
        return str
      },
      error: (settings) => {
        let str = ``
        for (const setting of settings) {
          str += this.genError(setting) + `\n`
        }
        return str
      },
      use: (settings) => {
        let str = ``
        for (const setting of settings) {
          str += this.genUse(setting) + `\n`
        }
        return str
      },
    }

    let str = `/**\n${apiSampleRequestStr}\n`
    for (const key in settingMap) {
      const fn = fnMap[key]
      if (!fn) continue
      const setting = settingMap[key]
      str += fn(setting)
    }
    str += `*/`
    this._writeApiFile(settingMap.group, str)
  }

  outputDefine (name, data) {
    let str = `/**\n`
    str += this.genDefine({name, data}) + `\n`
    str += `*/`
    this._writeDefineFile(str)
  }

  unlinkDocFiles () {
    const files = this._fs.readdirSync(this._docDir)
    for (const file of files) {
      const subPath = `${this._docDir}/${file}`
      this._unlinkDirRecursively(subPath)

      const stats = this._fs.statSync(subPath)
      if (!stats.isDirectory()) {
        this._fs.unlinkSync(subPath)
      }
    }
  }
}

module.exports = ApiDoc
