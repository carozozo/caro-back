class RequestDat extends ck.MongoData {
  constructor () {
    const model = ck.requestMod.model

    super(model)
  }
}

module.exports = new RequestDat()
