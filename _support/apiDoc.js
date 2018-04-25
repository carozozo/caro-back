/* 提供執行 api document 建置 */
class ApiDoc extends ck.ApiDoc {
  _toString (data) {
    // 轉換 res.ok 的 suc 內容
    if (_.size(data) && data.suc) {
      const suc = data.suc
      if (_.isArray(suc)) data.suc = suc.slice(0, 1)
    }
    return super._toString(data)
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
}

module.exports = new ApiDoc(`${ck.PROJECT_PATH}/docs`, `defineDoc.js`, !process.env.DOC)
