class CountLoggedUserDat extends ck.MongoModel {
  constructor () {
    const model = ck.countLoggedUserMod.model
    super(model)
  }
}

module.exports = new CountLoggedUserDat()
