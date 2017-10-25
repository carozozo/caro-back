class ProfileSch {
  constructor () {
    const db = ck.mainDb
    const Sequelize = db.Sequelize
    this.fields = {
      name: {type: Sequelize.STRING(20), allowNull: false}, // 使用者姓名
      email: {type: Sequelize.STRING(25)}, // 電子郵件
      phone: {type: Sequelize.STRING(15)} // 手機號碼
    }
  }
}

module.exports = new ProfileSch()
