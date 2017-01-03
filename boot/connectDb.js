ck.boot.regStack(async () => {
  const redisConfig = ck.config.getRedis(`session`)
  const host = redisConfig.host
  const port = redisConfig.port
  const database = redisConfig.database
  const redisMsg = `Redis 資料庫 ${host}:${port} ${database}`
  ck.info(`準備連接 Redis ${redisMsg}`)
  await ck.cacheDb.connectDb(host, port, database)
  ck.info(`已連接 Redis ${redisMsg}`)
})

ck.boot.regStack(async () => {
  const dbConfig = ck.config.getMongoDb(`analysis`)
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Mongo 資料庫 ${host}:${port} ${database}`
  ck.info(`準備連接 ${dbMsg}`)
  await ck.analysisDb.connectDb(host, port, database)
  ck.info(`已連接 ${dbMsg}`)
})

ck.boot.regStack(async () => {
  const dbConfig = ck.config.getMysql()
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Maria 資料庫 ${host}:${port} ${database}`
  ck.info(`準備連接 ${dbMsg}`)
  await ck.mainDb.connectDb(dbConfig.host, dbConfig.port, dbConfig.database, dbConfig.username, dbConfig.pwd, {
    dialect: `mysql`,
    logging: false,
  })
  ck.info(`已連接 ${dbMsg}`)
})
