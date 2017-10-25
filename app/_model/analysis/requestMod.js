// request 紀錄
class RequestMod {
  constructor () {
    this.schema = ck.mongoSchema.createSchema(ck.requestSch.fields)
    this.model = ck.analysisDb.createModel(`Request`, this.schema)
  }
}

module.exports = new RequestMod()
