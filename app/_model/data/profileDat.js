class ProfileDat extends ck.SequelizeData {
  constructor () {
    const model = ck.profileSch.model
    super(model)
  }
}

module.exports = new ProfileDat()
