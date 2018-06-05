ck.boot.regStack(async () => {
  const dbConfig = ck.config.logDb
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Mongo 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 ${dbMsg}`)
  await ck.bootMongo(ck.logDb, dbConfig, {
    user: dbConfig.username,
    pass: dbConfig.pwd,
    auth: {
      authdb: `admin`,
    },
  })
  ck.logger.log(`已連接 ${dbMsg}`)
})
