/* 提供測試用 request functions */
class Poster extends ck.RequestPromise {
  _genHeader (role, opt = {}) {
    const roleIndex = opt.roleIndex || 0
    return {[ck.auth.authKey]: `${ck.auth.tokenKey} ${ck.tester.getMapByRole(role, roleIndex).tokenId}`}
  }

  setApiUrl (apiUrl) {
    super._apiUrl = apiUrl
  }

  async post (path, body, role, opt = {}) {
    opt.body = body
    if (role) opt.headers = this._genHeader(role, opt)
    return super.post(path, body, opt)
  }

  async get (path, role, opt = {}) {
    if (role) opt.headers = this._genHeader(role, opt)
    return super.get(path, opt)
  }

  async put (path, body, role, opt = {}) {
    opt.body = body
    if (role) opt.headers = this._genHeader(role, opt)
    return super.put(path, body, opt)
  }

  async delete (path, body, role, opt = {}) {
    opt.body = body
    if (role) opt.headers = this._genHeader(role, opt)
    return super.delete(path, body, opt)
  }
}

module.exports = new Poster()
