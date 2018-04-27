/* 提供處理 req 的函式 */
class Req {
  // 檢查必要參數, 並回傳 client 傳送的參數
  validateRequired (req, keys) {
    const args = req.args
    _.forEach(keys, key => {
      if (_.isNil(args[key])) throw Error(`缺少必要參數 ${key}`)
    })
    return args
  }
}

module.exports = new Req()
