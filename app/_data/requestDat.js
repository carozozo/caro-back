class RequestDat extends ck.MongoData {
  constructor () {
    const model = ck.requestSch.model

    super(model)
  }
}

module.exports = new RequestDat()
