// request 紀錄
class RequestMod extends ck.MongoModel {
  constructor () {
    const model = ck.logDb.createModel(`Request`, ck.requestSch.schema)
    
    super(model)
  }
}

module.exports = new RequestMod()
