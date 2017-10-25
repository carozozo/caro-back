class UserMod {
  constructor () {
    const db = ck.mainDb
    this.model = db.createModel(`User`, ck.userSch.fields)
    this.model.hasMany(ck.profileDat.model, {
      sourceKey: `username`,
      foreignKey: {name: `user_username`, allowNull: false}
    })
  }
}

module.exports = new UserMod()
