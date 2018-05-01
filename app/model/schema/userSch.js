class UserSch {
  constructor () {
    const db = ck.mainDb
    const Sequelize = db.Sequelize

    this.fields = {
      username: {type: Sequelize.STRING(25), allowNull: false, unique: true}, // 使用者名稱
      pwd: {type: Sequelize.STRING(100), allowNull: false}, // 使用者密碼
      role: { // 身份
        type: Sequelize.ENUM.apply(null, ck.config.userRoles), defaultValue: `customer`
      }
    }
  }
}

module.exports = new UserSch()
