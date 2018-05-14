class ProfileSch {
  constructor () {
    const db = ck.mainDb
    const Sequelize = db.Sequelize

    const name = `ProfileSch`
    const comment = `使用者資料`
    const fields = {
      name: {
        type: Sequelize.STRING(20), allowNull: false, comment: `使用者姓名`
      },
      email: {
        type: Sequelize.STRING(25), comment: `電子郵件`
      },
      phone: {
        type: Sequelize.STRING(15), comment: `手機號碼`
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

module.exports = new ProfileSch()
