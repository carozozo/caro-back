ck.boot.regStack(async () => {
  // 清除資料
  if (!ck.unit.canDropDb) return
  const cleanMsg = `Redis 資料庫 ${ck.cacheDb.database}`
  ck.logger.log(`準備清除 ${cleanMsg} 資料`)
  await ck.cacheDb.flushdb()
  ck.logger.log(`${cleanMsg} 清除完成`)
})
