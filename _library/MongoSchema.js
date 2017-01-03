/* 提供 this._mongoose 客製化 schema */
class MongoSchema {
  constructor () {
    const self = this
    self._mongoose = require(`mongoose`)
    self._mongoose.Promise = global.Promise // 讓 this._mongoose 支援 Promise
  }

  _preSave (next) {
    this.updatedAt = Date.now()
    this.markModified(`updatedAt`)
    next()
  }

  _preUpdate (next) {
    const criteria = this.getUpdate()
    criteria.$inc = criteria.$inc || {}
    criteria.$inc.__v = 1 // 資料修改次數
    next()
  }

  get ObjectId () {
    return this._mongoose.Schema.Types.ObjectId
  }

  get Mixed () {
    return this._mongoose.Schema.Types.Mixed
  }

  _transResult (result) {
    for (const key in result) {
      const val = result[key]
      if (key.startsWith(`_`) && key !== `_id` && _.isPlainObject(val)) {
        result[`$${key.replace(`_`, ``)}`] = val
        result[key] = val._id
      }
    }
  }

  createSchema (fields, opt) {
    // fields 裡面會自動帶入 createdAt, updatedAt
    opt = _.assign({
      timestamps: true,
      toJSON: {
        transform: (doc, ret) => {
          this._transResult(ret)
          return ret
        }
      },
      toObject: {
        transform: (doc, ret) => {
          this._transResult(ret)
          return ret
        }
      }
    }, opt)
    const schema = new this._mongoose.Schema(fields, opt)
    schema.pre(`save`, this._preSave)
    schema.pre(`update`, this._preUpdate)
    schema.pre(`findOneAndUpdate`, this._preUpdate)
    schema.index({createdAt: -1})
    return schema
  }
}

module.exports = MongoSchema
