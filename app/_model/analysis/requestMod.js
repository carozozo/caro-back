// request 紀錄
class RequestMod {
  constructor () {
    this.model = ck.analysisDb.createModel(`Request`, ck.requestSch.schema)
  }
}

module.exports = new RequestMod()
