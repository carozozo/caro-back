/* 提供 mongoose 客製化操作服務 */
class Mongo {
  constructor () {
    this._mongoose = require(`mongoose`)
    this._mongoose.Promise = global.Promise // 讓 this._mongoose 支援 Promise
    this._hookMap = {}
    this._connection = undefined
    this.host = null
    this.port = null
    this.database = null
  }

  get mongoose () {
    return this._mongoose
  }

  get connection () {
    if (!this._connection) throw Error(`請先建立連線`)
    return this._connection
  }

  get ObjectId () {
    return this._mongoose.Types.ObjectId
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

  connectDb (host, port, database) {
    return new Promise((resolve) => {
      const url = `mongodb://${host}:${port}/${database}`
      const connection = this._connection = this._mongoose.createConnection(url)
      connection.$url = url
      connection.once(`open`, () => {
        this.host = host
        this.port = port
        this.database = database
        resolve(connection)
        this._triggerByOn(`connectDb`)
      })
    })
  }

  disconnect () {
    this._connection.close()
  }

  dropCollections (opt = {}) {
    return new Promise(async (resolve) => {
      const excludes = opt.excludes || []
      const models = this.connection.models
      const modelNames = await _.keys(models)
      const collectionLength = modelNames.length
      if (collectionLength === 0) {
        resolve(modelNames)
        await this._triggerByOn(`dropCollections`, [modelNames])
        return
      }
      const settleArr = []
      for (const index in modelNames) {
        const p = new Promise((resolve) => {
          const i = Number(index)
          const modelName = modelNames[i]
          if (!_.includes(excludes, modelName)) {
            models[modelName].remove({}, () => {
              this._triggerByOn(`dropCollectionsEach`, [modelName, i])
              resolve()
            })
          } else {
            this._triggerByOn(`dropCollectionsEachExclude`, [modelName, i])
            resolve()
          }
        })
        settleArr.push(p)
      }
      Promise.all(settleArr).then(() => {
        resolve(modelNames)
        this._triggerByOn(`dropCollections`, [modelNames])
      })
    })
  }

  createModel (modelName, schema) {
    return this.connection.model(modelName, schema, modelName)
  }
}

module.exports = Mongo
