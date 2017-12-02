// 紀錄登入人數
class CountLoggedUserMod {
  constructor () {
    this.model = ck.analysisDb.createModel(`CountLoggedUser`, ck.countLoggedUserSch.schema)
  }
}

module.exports = new CountLoggedUserMod()
