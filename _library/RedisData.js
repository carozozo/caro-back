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

  scard (set) {
    return new Promise((resolve, reject) => {
      this.client.scard(set, (err, result) => {
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

  // 把 id 從索引中移除
  async _removeIdFromIndex (setName, id) {
    await this.srem(setName, id)
    if (await this.scard(setName) === 0) {
      this.del(setName)
    }
  }

  // 把 id 從所有的索引中移除
  async _removeIdFromAllIndex (id) {
    const setNamesOfIndex = this._genSetForIndex(`*`, `*`)
    const setNames = await this.keys(setNamesOfIndex)
    for (const setName of setNames) {
      this._removeIdFromIndex(setName, id)
    }
  }

  // 更新資料以及重新設定索引
  async _update (oldData, updateObj) {
    const id = oldData.id
    const key = this._genKey(id)
    for (const k in updateObj) {
      if (!updateObj.hasOwnProperty(k)) continue
      // 把 id 從原本的 index set 中移除
      const oldSetName = this._genSetForIndex(k, oldData[k])
      await this._removeIdFromIndex(oldSetName, id)
      // 把 id 加進新的 index set
      const newSetName = this._genSetForIndex(k, updateObj[k])
      await this.sadd(newSetName, id)
      // 更新每個值
      await this.hset(key, k, updateObj[k])
    }
    // 模擬 update 後的資料
    return _.assign(oldData, updateObj)
  }

  // 移除資料和索引
  async _remove (data) {
    const id = data.id
    const key = this._genKey(id)
    await this.del(key)
    for (const k in data) {
      if (!data.hasOwnProperty(k)) continue
      const v = data[k]
      const setName = this._genSetForIndex(k, v)
      await this._removeIdFromIndex(setName, id)
    }
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

  // 用要寫入的資料產生一組 key, 順便加入索引
  _genKeyByData (data) {
    if (!_.keys(data).includes(`id`)) {
      const uniqid = require(`uniqid`)
      data.id = uniqid()
    }
    // e.g. data = {id: 'xxx', username: 'caro'}
    const id = data.id
    // e.g. key = Category:xxx
    const key = this._genKey(id)
    _.forEach(data, (v, k) => {
      const setName = this._genSetForIndex(k, v)
      // 設置 id 到 _index:Category:username:caro
      this.sadd(setName, id)
    })
    return key
  }

  async create (data) {
    const key = this._genKeyByData(data)
    await this.hmset(key, data)
    return data
  }

  // 找出每一筆資料並直行 callback
  async _findEach (where, cb) {
    const ids = await this._getIdsByWhere(where)
    for (let i in ids) {
      if (!ids.hasOwnProperty(i)) continue
      i = Number(i)
      const id = ids[i]
      const key = this._genKey(id)
      const data = await this.hgetall(key)
      if (data) {
        if (await cb(data, key, i) === false) break
      } else {
        await this._removeIdFromAllIndex(id)
      }
    }
  }

  async find (where) {
    const ret = []
    await this._findEach(where, (data) => {
      ret.push(data)
    })
    return ret
  }

  async findOne (where) {
    let ret = null
    await this._findEach(where, (data) => {
      ret = data
      return false
    })
    return ret
  }

  async findById (id) {
    return this.findOne({id})
  }

  async update (where, updateObj) {
    const ret = []
    await this._findEach(where, async (data) => {
      const newData = await this._update(data, updateObj)
      ret.push(newData)
    })
    return ret
  }

  async updateOne (where, updateObj) {
    let ret = null
    await this._findEach(where, async (data) => {
      ret = await this._update(data, updateObj)
      return false
    })
    return ret
  }

  async updateById (id, updateObj) {
    const where = {id}
    return await this.updateOne(where, updateObj)
  }

  async remove (where) {
    const ret = []
    await this._findEach(where, async (data) => {
      await this._remove(data)
      ret.push(data)
    })
    return ret
  }

  async removeOne (where) {
    let ret = null
    await this._findEach(where, async (data) => {
      await this._remove(data)
      ret = data
      return false
    })
    return ret
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
    const ret = []
    await this._findEach(where, (data, key) => {
      this.expire(key, seconds)
      ret.push(data)
    })
    return ret
  }

  async expiredOne (where, seconds) {
    let ret = null
    await this._findEach(where, (data, key) => {
      this.expire(key, seconds)
      ret = data
      return false
    })
    return ret
  }

  async expiredById (id, seconds) {
    await this.expiredOne({id}, seconds)
  }
}

module.exports = RedisData
