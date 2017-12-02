class CountLoggedUserSch {
  constructor () {
    this.fields = {
      count: {type: Number}, // 登入的 user 數量
    }
    this.schema = ck.mongoSchema.createSchema(this.fields)
  }
}

module.exports = new CountLoggedUserSch()
