/* 提供 Redis 客製化操作服務 */
class Redis {
  constructor () {
    this._redis = require('redis')
    this._client = null
    this.host = null
    this.port = null
    this.datablase = null
  }

  get client () {
    if (!this._client) throw Error(`請先建立連線`)
    return this._client
  }

  connectDb (host = `127.0.0.1`, port = 6379, database = 0, opt = {}) {
    return new Promise((resolve, reject) => {
      opt = _.merge(opt, {host, port})
      const client = this._client = this._redis.createClient.apply(this._redis, opt)
      client.on('connect', async () => {
        await this.selectDb(database)
        this.host = host
        this.port = port
        this.database = database
        resolve()
      })
      client.on('error', (err) => {
        reject(err)
      })
    })
  }

  selectDb (index = 0) {
    return new Promise((resolve, reject) => {
      this.client.select(index, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  flushdb () {
    return new Promise((resolve, reject) => {
      this.client.flushdb((err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  disconnect () {
    this.client.quit()
  }
}

module.exports = Redis
