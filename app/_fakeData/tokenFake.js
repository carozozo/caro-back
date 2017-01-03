class TokenFake {
  genCreate (data = {}) {
    const _data = _.assign({
      username: undefined,
    }, data)
    return _data
  }

  async fake (data) {
    const _data = this.genCreate(data)
    return ck.tokenDat.create(_data)
  }
}

module.exports = new TokenFake()
