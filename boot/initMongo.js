ck.boot.regStack(async () => {
  // 清除資料
  if (!ck.unit.canDropDb) return
  const dbConfig = ck.config.logDb
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
