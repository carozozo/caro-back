class UserFake {
  genCreate (data = {}) {
    const role = data.role || `customer`
    let count = this[`_${role}Count`] || 0
    const username = data.username || `${role}${++count}Fake`

    const _data = _.assign({
      username,
      pwd: username,
      role
    }, data)
    this[`_${role}Count`] = count
    return _data
  }

  async fake (data) {
    const _data = this.genCreate(data)
    return ck.userDat.create(_data)
  }
}

module.exports = new UserFake()
