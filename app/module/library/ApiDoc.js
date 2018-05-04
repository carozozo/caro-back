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
    let method = opt.method
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
    return `@apiHeader (HEADER) {${type}} ${field} ${desc}`
  }

  genParam (opt) {
    const field = opt.field
    let type = opt.type
    let desc = opt.desc
    type = _.upperFirst(type)
    desc = _.upperFirst(desc)
    return `@apiParam (PARAM) {${type}} ${field} ${desc}`
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

  outputApi (opt = {}) {
    const apiSampleRequestStr = `@apiSampleRequest off`
    let str = `/**\n${apiSampleRequestStr}\n`

    for (const key in opt) {
      switch (key) {
      case `version`:
        str += this.genVersion(opt[key]) + `\n`
        break
      case `api`:
        str += this.genApi(opt[key]) + `\n`
        break
      case `description`:
        str += this.genDescription(opt[key]) + `\n`
        break
      case `name`:
        str += this.genName(opt[key]) + `\n`
        break
      case `group`:
        str += this.genGroup(opt[key]) + `\n`
        break
      case `header`:
        for (const h of opt[key]) {
          str += this.genHeader(h) + `\n`
        }
        break
      case `param`:
        for (const p of opt[key]) {
          str += this.genParam(p) + `\n`
        }
        break
      case `success`:
        for (const s of opt[key]) {
          str += this.genSuccess(s) + `\n`
        }
        break
      case `error`:
        for (const e of opt[key]) {
          str += this.genError(e) + `\n`
        }
        break
      case `use`:
        for (const u of opt[key]) {
          str += this.genUse(u) + `\n`
        }
        break
      default:
        break
      }
    }
    str += `*/`
    this._writeApiFile(opt.group, str)
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
        console.log(`subPath=`, subPath)
        this._fs.unlinkSync(subPath)
      }
    }
  }
}

module.exports = ApiDoc
