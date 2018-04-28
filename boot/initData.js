const env = process.env.NODE_ENV
const workerIndex = parseInt(process.env.WORKER_INDEX || 0, 10)
const isFirstProcess = workerIndex === 0
const canDropDb = isFirstProcess && (env === `dev` || env === `beta`)

ck.boot.on(`runStacks`, async () => {
  const redisMsg = `Redis 資料庫 ${ck.cacheDb.database}`
  // 清除資料
  if (!canDropDb) return
  ck.logger.log(`準備清除 ${redisMsg} 資料`)
  await ck.cacheDb.flushdb()
  ck.logger.log(`${redisMsg} 清除完成`)
})

ck.boot.on(`runStacks`, async () => {
  const dbMSg = `Mongo 資料庫 ${ck.logDb.database}`
  // 清除資料
  if (!canDropDb) return
  const dbConfig = ck.config.logDb
  const excludes = dbConfig.excludes
  ck.logDb.on(`dropCollectionsEach`, (name, i) => {
    ck.logger.log(`${dbMSg} 清除第 ${i + 1} 組 collection ${name} 完成`)
  }).on(`dropCollectionsEachExclude`, (name, i) => {
    ck.logger.log(`${dbMSg} 排除第 ${i + 1} 組 collection ${name}`)
  })
  ck.logger.log(`準備清除 ${dbMSg} 資料`)
  const names = await ck.logDb.dropCollections({excludes}) || []
  ck.logger.log(`${dbMSg} 清除 ${names.length - excludes.length} 組資料完成`)
})

ck.boot.on(`runStacks`, async () => {
  const dbMSg = `Maria 資料庫 ${ck.mainDb.database}`
  if (isFirstProcess) {
    await ck.mainDb.sync()
  }
  // 清除資料
  if (!canDropDb) return
  const dbConfig = ck.config.mainDb
  const excludes = dbConfig.excludes
  ck.logger.log(`準備清除 ${dbMSg} 資料`)
  ck.mainDb.on(`dropTablesEach`, (name, i) => {
    ck.logger.log(`${dbMSg} 清除第 ${i + 1} 組 table ${name} 完成`)
  }).on(`dropTablesEachExclude`, (name, i) => {
    ck.logger.log(`${dbMSg} 排除第 ${i + 1} 組 table ${name}`)
  })
  const names = await ck.mainDb.dropTables({excludes})
  ck.logger.log(`${dbMSg} 清除 ${names.length - excludes.length} 組資料完成`)

  // 重新建立 table
  await ck.mainDb.sync()

  // 建立假資料
  ck.logger.log(`${dbMSg} 開始建立假資料`)
  ck.requireDir(`init/initData`)
  ck.logger.log(`${dbMSg} 假資料建立完畢`)

  // 建立測試帳號
  ck.logger.log(`開始建立測試 User, 每個 role ${ck.tester.roleAmount} 組`)
  await ck.tester.setTesters()
  ck.logger.log(`測試 User 建立完畢`)
})