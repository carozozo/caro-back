class RequestSch {
  constructor () {
    this.fields = {
      username: {type: String, required: true}, // 發出 request 的 user
      ip: {type: String, required: true}, // user ip
      baseUrl: {type: String, required: true}, // request url
      path: {type: String, required: true}, // request path
      method: { // method
        type: String,
        enum: [
          `POST`,
          `GET`,
          `PUT`,
          `DELETE`
        ],
        required: true
      },
      userAgent: {type: Object}, // request 代理資訊
      requestTime: {type: Date}, // 發出 request 的時間
      responseStatus: { // response 狀態
        type: String,
        enum: [
          `suc`, // 成功
          `err`, // 錯誤
          `war` // 警告
        ],
        required: true
      },
      responseMsg: {type: String} // 回傳的訊息, responseStatus = suc 時不寫入
    }
    this.schema = ck.mongoSchema.createSchema(this.fields)
  }
}

module.exports = new RequestSch()
