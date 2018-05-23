/* 發出 request 的 user class */
class ReqUser {
  constructor (user) {
    if (!user) throw Error(`ReqUser 缺少必要參數 user`)
    this.$data = user
    _.forEach(user, (val, key) => {
      this[key] = val
    })
  }

  _checkRole (role) {
    return this.$data.role === role
  }

  ifSameId (id) {
    return this.$data.id === id
  }

  ifCustomer () {
    return this._checkRole(`customer`)
  }

  ifStaff () {
    return this._checkRole(`staff`)
  }

  ifManager () {
    return this._checkRole(`manager`)
  }

  ifAdmin () {
    return this._checkRole(`admin`)
  }
}

module.exports = ReqUser
