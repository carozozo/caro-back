class CountLoggedUserDat extends ck.MongoData {
  constructor () {
    const model = ck.countLoggedUserMod.model
    super(model)
  }
}

module.exports = new CountLoggedUserDat()
