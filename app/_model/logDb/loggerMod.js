class LoggerMod extends ck.MongoModel {
  constructor () {
    const model = ck.logDb.createModel(`Logger`, ck.loggerSch.schema)

    super(model)
  }
}

module.exports = new LoggerMod()