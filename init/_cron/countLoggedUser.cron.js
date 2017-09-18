ck.cron.regJob(`每分鐘寫入登入人數`, `*/1 * * * *`, async () => {
  const count = await ck.tokenDat.count()
  await ck.countLoggedUserDat.create({count})
})