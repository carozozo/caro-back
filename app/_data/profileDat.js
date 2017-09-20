class ProfileDat extends ck.SequelizeData {
  constructor () {
    const model = ck.profileSch.model
    super(model)
  }

  get rolesNeedEmail () {
    return [`customer`, `stuff`, `manager`]
  }

  async createProfile (role, data) {
    const rolesNeedEmail = this.rolesNeedEmail
    if (_.includes(rolesNeedEmail, role)) {
      if (!data.email) throw `${rolesNeedEmail} 需輸入 email`
    }
    return this.create(data)
  }
}

module.exports = new ProfileDat()
