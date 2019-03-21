ck.cron.regTask(`每分鐘執行一次`, `*/1 * * * *`, async () => {
  ck.logger.log(`內容開始`)
  // 故意延遲, 測試下次觸發 task 會不會執行
  await new Promise((r) => {
    setTimeout(() => r(), 61000)
  })
  ck.logger.log(`內容結束`)
})