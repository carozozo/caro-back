class UserMod extends ck.MariaModel {
  constructor () {
    const model = ck.mainDb.createModel(`User`, ck.userSch.fields, {comment: ck.userSch.comment})
    model.hasMany(ck.profileMod.model, {
      sourceKey: `username`,
      foreignKey: {name: `user_username`, allowNull: false}
    })

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

    const crypto = require(`crypto`)
    const hash = crypto.createHash(`sha256`)
    hash.update(String(data.pwd))
    data.pwd = hash.digest(`hex`)
  }

  async _preUpdate (where, data) {
    if (!data.pwd) return
    const crypto = require(`crypto`)
    const hash = crypto.createHash(`sha256`)
    hash.update(String(data.pwd))
    data.pwd = hash.digest(`hex`)
  }

  async _preRemove (where) {
    const users = await this.find(where)
    for (const user of users) {
      await ck.tokenMod.remove({username: user.username})
    }
  }

  async findByUsername (username, ...args) {
    args.unshift({username})
    return this.findOne.apply(this, args)
  }

  async ifSamePwd (user, pwd) {
    const crypto = require(`crypto`)
    const hash = crypto.createHash(`sha256`)
    hash.update(String(pwd))
    pwd = hash.digest(`hex`)
    return user.pwd === pwd
  }
}

module.exports = new UserMod()
