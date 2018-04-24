ck.migration.regStack(`demo 在 User 新增 demoColumn 欄位`, async () => {
  const mainDb = ck.mainDb
  const QueryInterface = mainDb.QueryInterface
  const Sequelize = mainDb.Sequelize

  const userTable = await QueryInterface.describeTable(`User`)
  if (!userTable.demoColumn) {
    return await QueryInterface.addColumn(`User`, `demoColumn`, {type: Sequelize.STRING(25)})
  }
  return true
})