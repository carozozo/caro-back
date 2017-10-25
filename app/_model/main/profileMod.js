class ProfileMod {
  constructor () {
    const db = ck.mainDb
    this.model = db.createModel(`Profile`, ck.profileSch.fields)
  }
}

module.exports = new ProfileMod()
