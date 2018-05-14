class RequestSch {
  constructor () {
    const name = `RequestSch`
    const comment = `Request 紀錄`
    const fields = {
      username: {
        type: String,
        required: true,
        default: `none`,
        comment: `發出 request 的 user`,
      },
      userRole: {
        type: String,
        required: true,
        default: `none`,
        comment: `發出 request 的 user role`,
      },
      ip: {
        type: String, required: true, comment: `user ip`,
      },
      baseUrl: {
        type: String, required: true, comment: `request url`,
      },
      path: {
        type: String, required: true, comment: `request path`,
      },
      method: {
        type: String,
        enum: [
          `POST`,
          `GET`,
          `PUT`,
          `DELETE`
        ],
        required: true,
        comment: `method`,
      },
      requestTime: {
        type: Date, required: true, comment: `request 的時間`,
      },
      requestArgs: {
        type: ck.mongoSchema.Mixed, comment: `request 傳送的參數`,
      },
      responseTime: {
        type: Date, required: true, comment: `response 的時間`,
      },
      responseData: {
        type: ck.mongoSchema.Mixed, comment: `response 的資料`,
      },
      processMilliseconds: {
        type: Number, required: true, comment: `處理 request 的毫秒數`,
      },
      responseStatus: {
        type: String,
        enum: [
          `suc`, // 成功
          `err`, // 錯誤
          `war` // 警告
        ],
        required: true,
        comment: `response 狀態`,
      },
      userAgent: {
        type: Object, required: true, comment: `request 代理資訊`,
      },
    }

    this.comment = comment
    this.fields = fields
    this.schema = ck.mongoSchema.createSchema(fields)

    ck.apiDoc.outputSchemaDoc({
      name,
      comment,
      fields,
    })
  }
}

module.exports = new RequestSch()
