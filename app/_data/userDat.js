class UserDat extends ck.SequelizeData {
  constructor () {
    const model = ck.userSch.model

    super(model)

    this.pre(`create`, this._preCreate)
    this.pre(`update`, this._preUpdate)
    this.pre(`remove`, this._preRemove)
  }

  async _preCreate (data) {
    const username = data.username
    if (!username) throw `請輸入帳號`

    const pwd = data.pwd
    if (!pwd) throw `請輸入密碼`

    const user = await this.findByUsername(username)
    if (user) throw `帳號 ${username} 已存在`

    const bcrypt = require(`bcrypt`)
    data.pwd = bcrypt.hashSync(String(data.pwd), 1)
  }

  _preUpdate (where, data) {
    if (!data.pwd) return
    const bcrypt = require(`bcrypt`)
    data.pwd = bcrypt.hashSync(data.pwd, 1)
  }

  async _preRemove (where) {
    const users = await this.find(where)
    for (const user of users) {
      await ck.tokenDat.remove({username: user.username})
    }
  }

  async findByUsername (username, ...args) {
    args.unshift({username})
    return this.findOne.apply(this, args)
  }

  async ifSamePwd (user, pwd) {
    const bcrypt = require(`bcrypt`)
    return bcrypt.compareSync(pwd, user.pwd)
  }
}

module.exports = new UserDat()
