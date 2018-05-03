ck.boot.regStack(async () => {
  const redisConfig = ck.config.cacheDb
  const host = redisConfig.host
  const port = redisConfig.port
  const database = redisConfig.database
  const redisMsg = `Redis 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 Redis ${redisMsg}`)
  await ck.bootRedis(ck.cacheDb, redisConfig)
  ck.logger.log(`已連接 Redis ${redisMsg}`)

  // 清除資料
  if (!ck.unit.canDropDb) return
  const cleanMsg = `Redis 資料庫 ${ck.cacheDb.database}`
  ck.logger.log(`準備清除 ${cleanMsg} 資料`)
  await ck.cacheDb.flushdb()
  ck.logger.log(`${cleanMsg} 清除完成`)
})
