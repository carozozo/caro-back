class UserSer {
  async register (data, profileData, authMethod) {
    const role = data.role

    if (!authMethod) throw `請選擇驗證方式`
    const user = await ck.userDat.create(data)

    profileData.user_username = user.username
    const profile = await ck.profileDat.createProfile(role, profileData)

    if (authMethod === `email`) {
      ck.mail.sendRegisterMail()
    } else if (authMethod === `sms`) {
      ck.sms.sendRegisterMsg()
    }
    delete user.pwd
    return {user, profile}
  }

  async login (username, pwd) {
    if (!username) throw `請輸入帳號`
    if (!pwd) throw `請輸入密碼`
    const user = await ck.userDat.findByUsername(username)
    if (!user) throw `帳號不存在`
    if (!await ck.userDat.ifSamePwd(user, pwd)) throw `密碼錯誤`

    let token = await ck.tokenDat.findOne({username})
    if (token) {
      token = await ck.tokenDat.extendExpiredTime({username})
    } else {
      token = await ck.tokenDat.create({username})
    }
    delete user.pwd
    return {user, token}
  }

  async getById (id) {
    const user = await ck.userDat.findById(id)
    user && delete user.pwd
    return user
  }

  async getList (param = {}) {
    const username = param.username
    const offset = param.offset || 0
    const limit = param.limit || 50

    const where = {}
    const opt = {
      offset,
      limit
    }
    if (username) where.username = {$like: `%${username}%`}
    const list = await ck.userDat.find(where, opt)
    return _.map(list, (u) => {
      delete u.pwd
      return u
    })
  }

  async logout (username) {
    return ck.tokenDat.remove({username})
  }

  async updateById (id, data) {
    const user = await ck.userDat.updateById(id, data, {new: true})
    user && delete user.pwd
    return user
  }
}

module.exports = new UserSer()
