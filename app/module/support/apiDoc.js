/* 提供執行 api document 建置 */
class ApiDoc extends ck.ApiDoc {
  constructor () {
    super(`${process.env.PWD}/docs`, `defineDoc.js`)

    this._isOutputFile = process.env.DOC
    this._defaultVersion = require(`package.json`).version
    if (this._isOutputFile) {
      super.unlinkDocFiles()
      this.outputDefineDoc()
    }
  }

  get commonUse () {
    return [`authHeader`]
  }

  outputDefineDoc () {
    const name = `authHeader`
    this.outputDefine(name, this.genHeader({
      type: `string`,
      field: `Authorization`,
      desc: `CaroAuth token of each request`
    }))
  }

  outputApi (opt = {}) {
    if (!this._isOutputFile) return

    // 額外支援參數 roles => @apiDescription 會顯示限制的 user 權限
    const roles = opt.roles
    if (roles) opt.description = _.addHead(opt.description || ``, `使用權限: ${roles}; `)
    super.outputApi(opt)
  }

  outputResultDoc (docObj, sucArr, errArr) {
    if (!this._isOutputFile) return

    if (!sucArr) throw Error(`請輸入 sucArr`)
    if (!errArr) throw Error(`請輸入 errArr`)
    docObj.version = docObj.version || this._defaultVersion
    docObj.success = (() => {
      const result = []
      _.reduce(sucArr, (result, suc, i) => {
        result.push({name: `success${i + 1}`, data: suc})
        return result
      }, result)
      return result
    })()
    docObj.error = (() => {
      const result = []
      _.reduce(errArr, (result, err, i) => {
        result.push({name: `error${i + 1}`, data: err})
        return result
      }, result)
      return result
    })()
    this.outputApi(docObj)
  }

  outputSchemaDoc (param) {
    const name = param.name
    const comment = param.comment
    const fields = param.fields
    const version = param.version || this._defaultVersion

    const docObj = {
      api: {
        method: `schema`,
        path: name,
        title: comment
      },
      version,
      group: `schema`,
      name,
      success: [{name: `fields`, data: fields}],
    }

    this.outputApi(docObj)
  }

  transSchemaFields (fields) {
    const obj = {}
    _.forEach(fields, (val, key) => {
      if (typeof val === `function`) {
        obj[key] = val.name
        return
      }
      if (_.isPlainObject(val)) {
        obj[key] = this.transSchemaFields(val)
        return
      }
      obj[key] = val
    })
    return obj
  }
}

module.exports = new ApiDoc()
