class RequestDat extends ck.MongoModel {
  constructor () {
    const model = ck.requestMod.model

    super(model)
  }
}

module.exports = new RequestDat()
