class UserSch {
  constructor () {
    const db = ck.mainDb
    const Sequelize = db.Sequelize

    const name = `UserSch`
    const comment = `帳號登入資料`
    const fields = {
      username: {
        type: Sequelize.STRING(25), allowNull: false, unique: true, comment: `使用者名稱`
      },
      pwd: {
        type: Sequelize.STRING(100), allowNull: false, comment: `使用者密碼`
      },
      role: {
        type: Sequelize.ENUM.apply(null, ck.config.userRoles), defaultValue: `customer`, comment: `身份`
      },
    }

    this.comment = comment
    this.fields = fields

    ck.apiDoc.outputSchemaDoc({
      name,
      comment,
      fields,
    })
  }
}

module.exports = new UserSch()
