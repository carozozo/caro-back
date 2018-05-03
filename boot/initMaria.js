ck.boot.regStack(async () => {
  // 清除資料
  if (!ck.unit.canDropDb) return
  const dbConfig = ck.config.mainDb
  const cleanMsg = `Maria 資料庫 ${ck.mainDb.database}`
  const excludes = dbConfig.excludes
  ck.logger.log(`準備清除 ${cleanMsg} 資料`)
  ck.mainDb.on(`dropTablesEach`, (name, i) => {
    ck.logger.log(`${cleanMsg} 清除第 ${i + 1} 組 table ${name} 完成`)
  }).on(`dropTablesEachExclude`, (name, i) => {
    ck.logger.log(`${cleanMsg} 排除第 ${i + 1} 組 table ${name}`)
  })
  const names = await ck.mainDb.dropTables({excludes})
  ck.logger.log(`${cleanMsg} 清除 ${names.length - excludes.length} 組資料完成`)

  // 重新建立 table
  await ck.mainDb.sync()

  // 建立假資料
  ck.logger.log(`${cleanMsg} 開始建立假資料`)
  ck.requireDir(`./initData`)
  ck.logger.log(`${cleanMsg} 假資料建立完畢`)

  // 建立測試帳號
  ck.logger.log(`開始建立測試 User, 每個 role ${ck.tester.roleAmount} 組`)
  await ck.tester.setTesters()
  ck.logger.log(`測試 User 建立完畢`)
})
