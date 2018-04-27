class LoggerSch {
  constructor () {
    this.fields = {
      type: { // 寫入的 log 類型
        type: String,
        required: true,
        default: ``
      },
      path: { // 呼叫 log 的檔案路徑
        type: String,
        required: true,
        default: ``
      },
      args: [{ // 寫入的 log 參數
        type: ck.mongoSchema.Mixed,
      }]
    }
    this.schema = ck.mongoSchema.createSchema(this.fields)
  }
}

module.exports = new LoggerSch()