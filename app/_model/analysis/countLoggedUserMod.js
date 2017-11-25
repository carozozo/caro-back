// 紀錄登入人數
class CountLoggedUserMod {
  constructor () {
    this.schema = ck.mongoSchema.createSchema(ck.countLoggedUserSch.fields)
    this.model = ck.analysisDb.createModel(`CountLoggedUser`, this.schema)
  }
}

module.exports = new CountLoggedUserMod()
