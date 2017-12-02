class TokenDat extends ck.RedisModel {
  constructor () {
    super(ck.cacheDb.client, `Token`)
  }

  async extendExpiredTime (where, days = 30) {
    const seconds = 86400 * days
    await this.expired(where, seconds)
  }
}

module.exports = new TokenDat()
