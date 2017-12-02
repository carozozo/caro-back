// 紀錄登入人數
class CountLoggedUserMod extends ck.MongoModel {
  constructor () {
    const model = ck.analysisDb.createModel(`CountLoggedUser`, ck.countLoggedUserSch.schema)

    super(model)
  }
}

module.exports = new CountLoggedUserMod()
