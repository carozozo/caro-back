/* 提供 sequalize 客製化操作服務 */
class Sequelize {
  constructor () {
    this.Sequelize = require(`sequelize`)
    this._hookMap = {}
    this._connection = undefined
    this._modelMap = {}
    this.host = null
    this.port = null
    this.database = null
  }

  get connection () {
    if (!this._connection) throw Error(`請先建立連線`)
    return this._connection
  }

  _getHook (fnName) {
    const hookMap = this._hookMap
    const hook = hookMap[fnName] = hookMap[fnName] || {}
    hook.on = hook.on || []
    return hook
  }

  async _triggerBy (triggerMethod, fnName, args) {
    const hook = this._getHook(fnName)
    const fns = hook[triggerMethod]
    for (const fn of fns) {
      await fn.apply(this, args)
    }
  }

  async _triggerByOn (fnName, args) {
    await this._triggerBy(`on`, fnName, args)
  }

  on (fnName, fn, bindName) {
    const hook = this._getHook(fnName)
    if (bindName) {
      hook.on[bindName] = fn
    } else {
      hook.on[_.size(hook.on)] = fn
    }
    return this
  }

  connectDb (host, port, database, username, pwd, opt = {}) {
    return new Promise((resolve, reject) => {
      opt = _.merge(opt, {host, port})
      this._connection = new this.Sequelize(database, username, pwd, opt)
      this._connection.authenticate().then((err) => {
        if (err) return reject(err)
        this.host = host
        this.port = port
        this.database = database
        resolve()
        this._triggerByOn(`connectDb`)
      })
    })
  }

  disconnect () {
    ck.debug(`disconnect`)
    this._connection.close()
  }

  async dropTables (opt = {}) {
    const modelMap = this._modelMap
    const foreignFailedMap = {}
    let failedCount = 0
    let index = 0
    const dropTables = async (map) => {
      const excludes = opt.excludes || []
      for (const modelName in map) {
        if (!modelMap.hasOwnProperty(modelName)) continue
        ck.debug(`dropTables`, modelName)
        const model = map[modelName]
        try {
          if (!_.includes(excludes, modelName)) {
            await model.drop()
            delete foreignFailedMap[modelName]
            this._triggerByOn(`dropTablesEach`, [modelName, index])
          } else {
            this._triggerByOn(`dropTablesEachExclude`, [modelName, index])
          }
          index++
        } catch (e) {
          if (++failedCount > 100) {
            ck.err(`清除 table ${modelName} 失敗`)
            throw e
          }
          // 如果是因為 foreign 存在而無法刪除, 先記錄在 foreignFailedMap 之後再執行刪除
          if (e.name === `SequelizeForeignKeyConstraintError`) foreignFailedMap[modelName] = model
          else throw e
        }
      }

      if (!_.isEmpty(foreignFailedMap)) {
        await dropTables(foreignFailedMap)
      }
    }
    await dropTables(modelMap)
    return _.keys(this._modelMap)
  }

  // 把定義的 model 建立成 table
  async sync (opt) {
    return this.connection.sync(opt)
  }

  createModel (modelName, schema, opt = {}) {
    ck.debug(`createModel`, modelName)
    opt = _.assign({
      paranoid: true // 預設假刪除
    }, opt)
    const model = this.connection.define(modelName, schema, opt)
    this._modelMap[modelName] = model
    return model
  }

  async query (...args) {
    return this.connection.query.apply(this.connection, args)
  }
}

module.exports = Sequelize
