class TokenFak {
  genCreate (data = {}) {
    const _data = _.assign({
      username: undefined,
    }, data)
    return _data
  }

  async fake (data) {
    const _data = this.genCreate(data)
    return ck.tokenMod.create(_data)
  }
}

module.exports = new TokenFak()
