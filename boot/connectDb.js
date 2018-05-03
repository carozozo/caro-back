ck.boot.regStack(async () => {
  const dbConfig = ck.config.logDb
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Mongo 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 ${dbMsg}`)
  await ck.logDb.connectDb(host, port, database)
  ck.logger.log(`已連接 ${dbMsg}`)
})

ck.boot.regStack(async () => {
  const dbConfig = ck.config.mainDb
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Maria 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 ${dbMsg}`)
  await ck.mainDb.connectDb(dbConfig.host, dbConfig.port, dbConfig.database, dbConfig.username, dbConfig.pwd, {
    dialect: `mysql`,
    logging: false,
  })
  ck.logger.log(`已連接 ${dbMsg}`)
})
