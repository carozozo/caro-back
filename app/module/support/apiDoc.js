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

  get commonHeaderUse () {
    return [`authHeader`]
  }

  genOptForQueryOneParam (tables, opt = []) {
    return _.concat(opt, [
      {type: `String=${tables}`, field: `[includes]`, desc: `要附加的資料表; e.g. 'table1,table2'`},
      {type: `String`, field: `[attributes]`, desc: `要篩選的欄位; e.g. 'field1,field2'`},
    ])
  }

  genOptForQueryListParam (tables, opt = []) {
    return _.concat(opt, [
      {type: `String=${tables}`, field: `[includes]`, desc: `要附加的資料表; e.g. 'table1,table2'`},
      {type: `String`, field: `[attributes]`, desc: `要篩選的欄位; e.g. 'field1,field2'`},
      {type: `Number`, field: `[offset=0]`, desc: `要跳過的數量`},
      {type: `Number`, field: `[limit=50]`, desc: `要取得的最大數量`},
    ])
  }

  outputDefineDoc () {
    this.outputDefine(`authHeader`, this.genHeader({
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
    const fields = _.cloneDeep(param.fields)
    const version = param.version || this._defaultVersion

    // 把 schema 裡的 type 轉成字串
    const convertType = (f) => {
      for (const key in f) {
        // e.g. f = {key: {type: String}}
        let define = f[key]
        // e.g. f = {key: [{type: String}]}
        if (Array.isArray(define)) {
          define = define[0]
        }
        const type = define.type

        // e.g. f = {key: {key1: {type: String}, key2: {type: String}}}
        if (!type) {
          convertType(define)
          continue
        }
        define.type = type.name || _.get(type, `constructor.name`, ``)
      }
    }

    convertType(fields)

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
