ck.boot.regStack(async () => {
  const dbConfig = ck.config.logDb
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Mongo 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 ${dbMsg}`)
  await ck.bootMongo(ck.logDb, dbConfig)
  ck.logger.log(`已連接 ${dbMsg}`)

  // 清除資料
  if (!ck.unit.canDropDb) return
  const cleanMsg = `Mongo 資料庫 ${ck.logDb.database}`
  const excludes = dbConfig.excludes
  ck.logDb.on(`dropCollectionsEach`, (name, i) => {
    ck.logger.log(`${cleanMsg} 清除第 ${i + 1} 組 collection ${name} 完成`)
  }).on(`dropCollectionsEachExclude`, (name, i) => {
    ck.logger.log(`${cleanMsg} 排除第 ${i + 1} 組 collection ${name}`)
  })
  ck.logger.log(`準備清除 ${cleanMsg} 資料`)
  const names = await ck.logDb.dropCollections({excludes}) || []
  ck.logger.log(`${cleanMsg} 清除 ${names.length - excludes.length} 組資料完成`)
})
