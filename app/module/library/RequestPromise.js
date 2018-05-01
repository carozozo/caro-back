/* 客製化 request-promise */
class RequestPromise {
  constructor (apiUrl) {
    this._apiUrl = apiUrl
  }

  async _sendRequest (method, apiUrl, path, opt) {
    const rp = require(`request-promise`)
    opt = opt || {}
    const options = _.assign({
      method,
      uri: `${apiUrl}${path}`,
      json: true
    }, opt)
    return rp(options)
  }

  async post (path, body, opt = {}) {
    opt.body = body
    return this._sendRequest(`POST`, this._apiUrl, path, opt)
  }

  async get (path, opt) {
    return this._sendRequest(`GET`, this._apiUrl, path, opt)
  }

  async put (path, body, opt = {}) {
    opt.body = body
    return this._sendRequest(`PUT`, this._apiUrl, path, opt)
  }

  async delete (path, body, opt = {}) {
    opt.body = body
    return this._sendRequest(`DELETE`, this._apiUrl, path, opt)
  }
}

module.exports = RequestPromise
