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

  // 把 schema fields 裡的 type 轉成字串
  _convertTypeOfSchemaFields (fields) {
    for (const key in fields) {
      // e.g. fields = {key: {type: String}}
      let define = fields[key]

      // e.g. fields = {key: [{type: String}]}
      if (Array.isArray(define)) {
        define = define[0]
      }
      const type = define.type

      // e.g. fields = {key: {key1: {type: String}, key2: {type: String}}}
      if (!type) {
        this._convertTypeOfSchemaFields(define)
        continue
      }
      define.type = type.name || _.get(type, `constructor.name`, ``)
    }
  }

  get commonHeaderUse () {
    return [`authHeader`]
  }

  genOptForQueryOneParam (tables, settings = []) {
    return _.concat(settings, [
      {type: `String=${tables}`, field: `[includes]`, desc: `要附加的資料表; e.g. 'table1,table2'`},
      {type: `String`, field: `[attributes]`, desc: `要篩選的欄位; e.g. 'field1,field2'`},
    ])
  }

  genOptForQueryListParam (tables, settings = []) {
    return _.concat(settings, [
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
      desc: `CaroAuth token for request`
    }))
  }

  outputApi (settingMap = {}) {
    if (!this._isOutputFile) return

    // 額外支援參數 roles => @apiDescription 會顯示限制的 user 權限
    const roles = settingMap.roles
    if (roles) settingMap.description = _.addHead(settingMap.description || ``, `使用權限: ${roles}; `)

    // 額外支援參數 pathParam/queryParam/bodyParam
    const paramGroupArr = [`path`, `query`, `body`]
    _.forEach(paramGroupArr, (paramGroup) => {
      const setting = settingMap[`${paramGroup}Param`]
      if (!setting) return

      settingMap.param = (settingMap.param || []).concat(_.map(setting, (p) => {
        p.group = paramGroup
        return p
      }))
    })

    super.outputApi(settingMap)
  }

  outputResultDoc (settingMap, sucArr, errArr) {
    if (!this._isOutputFile) return

    if (!sucArr) throw Error(`請輸入 sucArr`)
    if (!errArr) throw Error(`請輸入 errArr`)
    settingMap.version = settingMap.version || this._defaultVersion
    settingMap.success = (() => {
      const result = []
      _.reduce(sucArr, (result, suc, i) => {
        result.push({name: `success${i + 1}`, data: suc})
        return result
      }, result)
      return result
    })()
    settingMap.error = (() => {
      const result = []
      _.reduce(errArr, (result, err, i) => {
        result.push({name: `error${i + 1}`, data: err})
        return result
      }, result)
      return result
    })()
    this.outputApi(settingMap)
  }

  outputSchemaDoc (param) {
    const name = param.name
    const comment = param.comment
    const fields = _.cloneDeep(param.fields)
    const version = param.version || this._defaultVersion

    this._convertTypeOfSchemaFields(fields)

    const settingMap = {
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

    this.outputApi(settingMap)
  }
}

module.exports = new ApiDoc()
