ck.boot.on(`runStacks`, async () => {
  const redisMsg = `Redis 資料庫 ${ck.cacheDb.database}`
  // 清除資料
  if (!ck.CAN_DROP_DB) return
  ck.info(`準備清除 ${redisMsg} 資料`)
  await ck.cacheDb.flushdb()
  ck.info(`${redisMsg} 清除完成`)
})

ck.boot.on(`runStacks`, async () => {
  const dbMSg = `Mongo 資料庫 ${ck.analysisDb.database}`
  // 清除資料
  if (!ck.CAN_DROP_DB) return
  const excludes = [] // 不想被清空的 collection
  ck.analysisDb.on(`dropCollectionsEach`, (name, i) => {
    ck.info(`${dbMSg} 清除第 ${i + 1} 組 collection ${name} 完成`)
  }).on(`dropCollectionsEachExclude`, (name, i) => {
    ck.info(`${dbMSg} 排除第 ${i + 1} 組 collection ${name}`)
  })
  ck.info(`準備清除 ${dbMSg} 資料`)
  const names = await ck.analysisDb.dropCollections({excludes}) || []
  ck.info(`${dbMSg} 清除 ${names.length - excludes.length} 組資料完成`)
})

ck.boot.on(`runStacks`, async () => {
  const dbMSg = `Maria 資料庫 ${ck.mainDb.database}`
  if (ck.IS_FIRST_PROCESS) {
    await ck.mainDb.sync()
  }
  // 清除資料
  if (!ck.CAN_DROP_DB) return
  const excludes = [] // 不想被清空的 table
  ck.info(`準備清除 ${dbMSg} 資料`)
  ck.mainDb.on(`dropTablesEach`, (name, i) => {
    ck.info(`${dbMSg} 清除第 ${i + 1} 組 table ${name} 完成`)
  }).on(`dropTablesEachExclude`, (name, i) => {
    ck.info(`${dbMSg} 排除第 ${i + 1} 組 table ${name}`)
  })
  const names = await ck.mainDb.dropTables({excludes})
  ck.info(`${dbMSg} 清除 ${names.length - excludes.length} 組資料完成`)

  // 重新建立 table
  await ck.mainDb.sync()

  // 建立假資料
  ck.info(`${dbMSg} 開始建立假資料`)
  ck.requireDir(`${__dirname}/initData`, {skip: true})
  await ck.mainDb.stacker.runStacks()
  ck.info(`${dbMSg} 假資料建立完畢`)

  // 建立測試帳號
  ck.info(`開始建立測試 User`)
  await ck.tester.setTesters()
  ck.info(`測試 User 建立完畢`)
})