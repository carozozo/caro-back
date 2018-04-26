/* 提供執行 api document 建置 */
class ApiDoc extends ck.ApiDoc {
  get commonUse () {
    return [`authHeader`]
  }

  outputApi (opt = {}) {
    // 額外支援參數 roles => @apiDescription 會顯示限制的 user 權限
    const roles = opt.roles
    if (roles) opt.description = _.addHead(opt.description || ``, `使用權限: ${roles}; `)
    super.outputApi(opt)
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

  outputResultDoc (docObj, sucArr, errArr) {
    if (!sucArr) throw Error(`請輸入 sucArr`)
    if (!errArr) throw Error(`請輸入 errArr`)
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
}

module.exports = new ApiDoc(`${ck.PROJECT_PATH}/docs`, `defineDoc.js`, !process.env.DOC)
