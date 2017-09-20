// 紀錄登入人數
class CountLoggedUserSch {
  constructor () {
    this.fields = {
      count: {type: Number}, // 登入的 user 數量
    }
    this.schema = ck.mongoSchema.createSchema(this.fields)
    this.model = ck.analysisDb.createModel(`CountLoggedUser`, this.schema)
  }
}

module.exports = new CountLoggedUserSch()
