class ProfileFak {
  genCreate (data = {}) {
    let count = this._count || 0
    const _data = _.assign({
      name: `user${++count}`,
      email: `user${count}@gmail.com`,
      phone: `09${_.padStart(_.randomInt(99999999), `0`)}`
    }, data)
    this._count = count
    return _data
  }

  async fake (data) {
    const _data = this.genCreate(data)
    return ck.profileMod.create(_data)
  }
}

module.exports = new ProfileFak()
