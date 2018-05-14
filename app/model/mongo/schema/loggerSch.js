class LoggerSch {
  constructor () {
    const name = `LoggerSch`
    const comment = `Log 紀錄`
    const fields = {
      type: {
        type: String,
        required: true,
        default: ``,
        comment: `寫入的 log 類型`,
      },
      path: {
        type: String,
        required: true,
        default: ``,
        comment: `呼叫 log 的檔案路徑`,
      },
      args: [{
        type: ck.mongoSchema.Mixed,
        comment: `寫入的 log 參數`,
      }],
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

module.exports = new LoggerSch()