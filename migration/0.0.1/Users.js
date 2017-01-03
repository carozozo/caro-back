ck.migration.regStack(async () => {
  ck.log(`demo 在 Users 新增 demoColumn 欄位`)
  const result = await ck.mainDb.query('ALTER TABLE `Users` ADD COLUMN IF NOT EXISTS `demoColumn` VARCHAR(11)  NOT NULL  DEFAULT \'\'')
  ck.log(`result=`, result)
})