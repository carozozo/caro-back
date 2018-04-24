class RequestSch {
  constructor () {
    this.fields = {
      username: { // 發出 request 的 user
        type: String,
        required: true,
        default: `none`
      },
      userRole: { // 發出 request 的 user role
        type: String,
        required: true,
        default: `none`
      },
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
      requestTime: {type: Date, required: true}, // request 的時間
      responseTime: {type: Date, required: true}, // response 的時間
      processMilliseconds: {type: Number, required: true}, // 處理 request 的毫秒數
      responseStatus: { // response 狀態
        type: String,
        enum: [
          `suc`, // 成功
          `err`, // 錯誤
          `war` // 警告
        ],
        required: true
      },
      responseMsg: {type: String}, // 回傳的訊息, responseStatus = suc 時不寫入
      userAgent: {type: Object, required: true}, // request 代理資訊
    }
    this.schema = ck.mongoSchema.createSchema(this.fields)
  }
}

module.exports = new RequestSch()
