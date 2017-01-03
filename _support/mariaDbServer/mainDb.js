class MainDb extends ck.Sequelize {
  constructor () {
    super()
    this.stacker = new ck.Stacker()
  }
}

module.exports = new MainDb()
