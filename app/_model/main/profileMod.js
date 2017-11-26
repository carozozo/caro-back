class ProfileMod {
  constructor () {
    this.model = ck.mainDb.createModel(`Profile`, ck.profileSch.fields)
  }
}

module.exports = new ProfileMod()
