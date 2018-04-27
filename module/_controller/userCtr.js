class UserCtr {
  async register (data, profileData, authMethod) {
    const role = data.role

    if (!authMethod) throw `請選擇驗證方式`
    const user = await ck.userMod.create(data)

    profileData.user_username = user.username
    const profile = await ck.profileMod.createProfile(role, profileData)

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
    const user = await ck.userMod.findByUsername(username)
    if (!user) throw `帳號不存在`
    if (!await ck.userMod.ifSamePwd(user, pwd)) throw `密碼錯誤`

    let token = await ck.tokenMod.findOne({username})
    if (token) {
      token = await ck.tokenMod.extendExpiredTime({username})
    } else {
      token = await ck.tokenMod.create({username})
    }
    delete user.pwd
    return {user, token}
  }

  async logout (reqUser) {
    return ck.tokenMod.remove({username: reqUser.username})
  }

  async updateById (reqUser, id, data) {
    if (reqUser.ifCustomer() && !reqUser.ifSameId(id)) {
      throw `一般用戶只能更新自己的資料`
    }
    const user = await ck.userMod.updateById(id, data, {new: true})
    user && delete user.pwd
    return user
  }

  async getById (id) {
    const user = await ck.userMod.findById(id)
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
    const list = await ck.userMod.find(where, opt)
    return _.map(list, (u) => {
      delete u.pwd
      return u
    })
  }
}

module.exports = new UserCtr()
