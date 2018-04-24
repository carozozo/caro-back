ck.migration.regStack(`demo 在 User 移除 demoColumn 欄位`,async () => {
  const mainDb = ck.mainDb
  const QueryInterface = mainDb.QueryInterface

  const userTable = await QueryInterface.describeTable(`User`)
  if (userTable.demoColumn) {
    return await QueryInterface.removeColumn(`User`, `demoColumn`)
  }
  return true
})