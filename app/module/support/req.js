/* 提供處理 req 的函式 */
class Req {
  // 指定哪些 request path 不要寫入傳送的參數
  get pathArrForSkipLogArgs () {
    return [
      `user/login`,
    ]
  }

  // 判斷路徑是否不要寫入 args
  ifPathInSkipLogArgs (path) {
    return _.some(this.pathArrForSkipLogArgs, (skipPath) => {
      return `${path}/`.includes(`/${skipPath}/`)
    })
  }

  async writeRequestLog (req, param) {
    const requestTime = req.requestTime
    const method = req.method
    const originalUrl = req.originalUrl

    const username = _.get(req, `reqUser.$data.username`)
    const userRole = _.get(req, `reqUser.$data.role`)
    const ip = req.headers[`x-forwarded-for`] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress

    const responseTime = param.responseTime
    const responseStatus = param.responseStatus
    const responseData = param.responseData

    const processMilliseconds = new Date(responseTime) - new Date(requestTime)
    const requestArgs = this.ifPathInSkipLogArgs(originalUrl) ? `[skip]` : req.args

    await ck.requestMod.create({
      username,
      userRole,
      ip,
      originalUrl,
      method,
      requestTime,
      requestArgs,
      responseTime,
      responseData,
      processMilliseconds,
      responseStatus,
      userAgent: req.useragent,
    })
  }

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
