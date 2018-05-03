ck.boot.regStack(async () => {
  const dbConfig = ck.config.mainDb
  const host = dbConfig.host
  const port = dbConfig.port
  const database = dbConfig.database
  const dbMsg = `Maria 資料庫 ${host}:${port} ${database}`
  ck.logger.log(`準備連接 ${dbMsg}`)
  await ck.bootMaria(ck.mainDb, dbConfig)
  ck.logger.log(`已連接 ${dbMsg}`)

  if (ck.unit.isFirstProcess) {
    await ck.mainDb.sync()
  }
})
