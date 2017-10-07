ck.migration.regStack(`demo 在 Users 移除 demoColumn 欄位`, async () => {
  return await ck.mainDb.query(`ALTER TABLE \`Users\` DROP COLUMN IF EXISTS \`demoColumn\``)
})