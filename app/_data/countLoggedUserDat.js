class CountLoggedUserDat extends ck.MongoData {
  constructor () {
    const model = ck.countLoggedUserSch.model

    super(model)
  }
}

module.exports = new CountLoggedUserDat()
