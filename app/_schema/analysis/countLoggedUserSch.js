class CountLoggedUserSch {
  constructor () {
    this.fields = {
      count: {type: Number}, // 登入的 user 數量
    }
  }
}

module.exports = new CountLoggedUserSch()
