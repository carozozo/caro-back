ck.cron.regJob(`每分鐘寫入登入人數`, `*/1 * * * *`, async () => {
  // 故意延遲, 測試下次觸發 task 會不會執行
  await new Promise((r) => {
    setTimeout(() => r(), 61000)
  })
  const count = await ck.tokenMod.count()
  return await ck.countLoggedUserMod.create({count})
})