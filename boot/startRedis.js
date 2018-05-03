ck.boot.regStack(async () => {
  const redisConfig = ck.config.cacheDb
  const host = redisConfig.host
  const port = redisConfig.port
  const database = redisConfig.database
  const redisMsg = `Redis 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 Redis ${redisMsg}`)
  await ck.bootRedis(ck.cacheDb, redisConfig)
  ck.logger.log(`已連接 Redis ${redisMsg}`)
})
