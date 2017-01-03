/* Redis 資料操作 promise 版 */
class RedisModel {
  constructor (client) {
    if (!client) throw Error(`缺少參數 client`)
    this.client = client // redis client
  }

  keys (strForSearch) {
    return new Promise((resolve, reject) => {
      this.client.keys(strForSearch, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  hset (key, field, val) {
    return new Promise((resolve, reject) => {
      this.client.hset(key, field, val, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  hmset (key, data) {
    return new Promise((resolve, reject) => {
      this.client.hmset(key, data, (err) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }

  hgetall (key) {
    return new Promise((resolve, reject) => {
      this.client.hgetall(key, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  del (key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  rename (key, newKey) {
    return new Promise((resolve, reject) => {
      this.client.rename(key, newKey, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  expire (key, seconds) {
    this.client.expire(key, seconds)
  }

  sadd (set, val) {
    return new Promise((resolve, reject) => {
      this.client.sadd(set, val, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  sinter (sets) {
    return new Promise((resolve, reject) => {
      this.client.sinter(sets, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  srem (set, val) {
    return new Promise((resolve, reject) => {
      this.client.srem(set, val, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}

/* 客製化 Redis 資料操作 */
class RedisData extends RedisModel {
  constructor (client, category) {
    super(client)
    this._category = category // 分類名稱
  }

  _genKey (id) {
    return `${this._category}:${id}`
  }

  _getIdFromKey (key) {
    return key.split(`:`).pop()
  }

  _genSetForIndex (k, v) {
    // data = {username: caro} => _index:Category:username:caro
    return `_index:${this._category}:${k}:${v}`
  }

  // 建立可以用來搜尋的 key
  _genKeyForSearch (data) {
    if (!_.keys(data).includes(`id`)) {
      const uniqid = require(`uniqid`)
      data.id = uniqid()
    }
    const id = data.id
    const key = this._genKey(id)
    _.forEach(data, (v, k) => {
      const setName = this._genSetForIndex(k, v)
      // e.g. 設置 id 到 _index:Category:username:caro
      this.sadd(setName, id)
    })
    return key
  }

  // 更新資料以及重新設定搜尋 key
  async _update (id, updateObj) {
    const key = this._genKey(id)
    const oldData = await this.hgetall(key)
    for (const k in updateObj) {
      if (!updateObj.hasOwnProperty(k)) continue
      // 把 id 從原本的 index set 中移除
      const oldSetName = this._genSetForIndex(k, oldData[k])
      await this.srem(oldSetName, id)
      // 把 id 加進新的 index set
      const newSetName = this._genSetForIndex(k, updateObj[k])
      await this.sadd(newSetName, id)
      // 更新每個值
      await this.hset(key, k, updateObj[k])
    }
    // 模擬 update 後的資料
    return _.assign(oldData, updateObj)
  }

  // 用 where 去取得要抓取的資料 id
  async _getIdsByWhere (where) {
    if (_.isEmpty(where)) {
      // 搜尋條件是空的 => 找出所有的 id
      const ret = []
      const keyForSearch = this._genKey(`*`)
      const keys = await this.keys(keyForSearch)
      for (const key of keys) {
        const id = this._getIdFromKey(key)
        ret.push(id)
      }
      return ret
    }

    const arr = _.reduce(where, (result, v, k) => {
      result.push(this._genSetForIndex(k, v))
      return result
    }, [])
    return await this.sinter(arr)
  }

  async create (data) {
    const key = this._genKeyForSearch(data)
    await this.hmset(key, data)
    return data
  }

  async find (where) {
    const ret = []
    const ids = await this._getIdsByWhere(where)
    for (const id of ids) {
      const key = this._genKey(id)
      const data = await this.hgetall(key)
      if (data) ret.push(data)
    }
    return ret
  }

  async findOne (where) {
    const list = await this.find(where)
    return list[0] || null
  }

  async findById (id) {
    return this.findOne({id})
  }

  async update (where, updateObj) {
    const ret = []
    const ids = await this._getIdsByWhere(where)
    for (const id of ids) {
      const newData = await this._update(id, updateObj)
      ret.push(newData)
    }
    return ret
  }

  async updateOne (where, updateObj) {
    const ids = await this._getIdsByWhere(where)
    if (_.isEmpty(ids)) return null

    const id = ids[0]
    return this._update(id, updateObj)
  }

  async updateById (id, updateObj) {
    const where = {id}
    return await this.updateOne(where, updateObj)
  }

  async remove (where) {
    const ids = await this._getIdsByWhere(where)
    for (const id of ids) {
      const key = this._genKey(id)
      await this.del(key)
    }
  }

  async removeOne (where) {
    const ids = await this._getIdsByWhere(where)
    if (_.isEmpty(ids)) return

    const id = ids[0]
    const key = this._genKey(id)
    return this.del(key)
  }

  async removeById (id) {
    const where = {id}
    await this.removeOne(where)
  }

  async count (where) {
    const result = await this.find(where)
    return result.length
  }

  async expired (where, seconds) {
    const ids = await this._getIdsByWhere(where)
    for (const id of ids) {
      const key = this._genKey(id)
      this.expire(key, seconds)
    }
  }

  async expiredOne (where, seconds) {
    const ids = await this._getIdsByWhere(where)
    if (_.isEmpty(ids)) return

    const id = ids[0]
    const key = this._genKey(id)
    this.expire(key, seconds)
  }

  async expiredById (id, seconds) {
    await this.expiredOne({id}, seconds)
  }
}

module.exports = RedisData
