class UserMod {
  constructor () {
    this.model = ck.mainDb.createModel(`User`, ck.userSch.fields)
    this.model.hasMany(ck.profileDat.model, {
      sourceKey: `username`,
      foreignKey: {name: `user_username`, allowNull: false}
    })
  }
}

module.exports = new UserMod()
