ck.migration.regStack(async () => {
  ck.log(`demo 在 Users 移除 demoColumn 欄位`)
  const result = await ck.mainDb.query('ALTER TABLE `Users` DROP COLUMN IF EXISTS `demoColumn`')
  ck.log(`result=`, result)
})