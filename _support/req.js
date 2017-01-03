class Req {
  getReqArgs (req, keys) {
    const args = req.args
    _.forEach(keys, key => {
      if (_.isNil(args[key])) throw Error(`缺少必要參數 ${key}`)
    })
    return args
  }
}

module.exports = new Req()
