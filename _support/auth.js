/* 提供登入驗證服務 */
class Auth {
  constructor () {
    this._passport = require(`passport`)
  }

  get authKey () {
    return `caroAuth`
  }

  get tokenKey () {
    return `CaroBack`
  }

  async _authToken (req, res, next) {
    const headers = req.headers
    const query = req.query
    const body = req.body
    const authorization = headers[ck.auth.authKey.toLowerCase()] || query[ck.auth.authKey] || body[ck.auth.authKey]
    if (!authorization) return next(`沒有訪問憑證`)

    const arr = authorization.split(` `)
    const tokenKey = arr[0]
    const tokenId = arr[1]
    if (tokenKey !== ck.auth.tokenKey) return next(`訪問憑證無效(key)`)

    const token = await ck.tokenMod.findOne({id: tokenId})
    if (!token) return next(`訪問憑證不存在`)

    // 設置 reqUser object
    const username = token.username
    const user = await ck.userMod.findOne({username})
    req.reqUser = new ck.ReqUser(user)
    next()
  }

  authRole (...args) {
    return [this._authToken, (req, res, next) => {
      if (!_.isEmpty(args) && !args.includes(req.reqUser.$data.role)) return next(`權限不足`)
      next()
    }]
  }

  init () {
    return this._passport.initialize()
  }
}

module.exports = new Auth()
