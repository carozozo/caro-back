ck.boot.on(`runStacks`, async () => {
  if (!ck.IS_FIRST_PROCESS) return
  const cron = ck.cron
  ck.requireDir(`${__dirname}/_cron`, {skip: true})
  cron.befTask((description, expression) => {
    ck.info(`執行 Cron Job: ${description} [${expression}]`)
  }).run((description, expression) => {
    ck.info(`載入 Cron Job: ${description} [${expression}]`)
  })
})
