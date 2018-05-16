/* 提供處理 req 的函式 */
class Req {
  // 判斷路徑是否不要寫入 response
  ifPathInSkipLogResponse (path) {
    return _.some(ck.config.resSetting.pathArrForSkipLogResponse, (skipPath) => {
      return `${path}/`.includes(`/${skipPath}/`)
    })
  }

  // 簡化 response 資料 for log
  contractResponse (path, status, response) {
    // 如果要 log 的狀態是 suc, 但不要寫入回傳的結果
    if (status === `suc` && this.ifPathInSkipLogResponse(path)) return `[skip]`

    const maxLength = 10
    if (!_.isArray(response) || response.length <= maxLength) return response

    const responseDataLength = response.length
    const ret = []

    for (let i = 0; i < maxLength; i++) {
      ret.push(response[i])
    }
    ret.push(`... and ${responseDataLength - maxLength} more`)
    return ret
  }

  convertResponseData (data) {
    if (_.isError(data)) return data.message + data.stack
    return data
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
