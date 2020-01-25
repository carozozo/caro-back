class ProfileMod extends ck.MariaModel {
  constructor () {
    const model = ck.mainDb.createModel(`Profile`, ck.profileSch.fields, {comment: ck.profileSch.comment})

    super(model)
  }

  get rolesNeedEmail () {
    return [`customer`, `staff`, `manager`]
  }

  async createProfile (role, data) {
    const rolesNeedEmail = this.rolesNeedEmail
    if (_.includes(rolesNeedEmail, role)) {
      if (!data.email) throw `${rolesNeedEmail} 需輸入 email`
    }
    return this.create(data)
  }
}

module.exports = new ProfileMod()
