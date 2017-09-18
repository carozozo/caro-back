ck.boot.on(`runStacks`, async () => {
  if (!ck.IS_FIRST_PROCESS) return
  const cron = ck.cron
  const log = (name, expression, description) => {
    ck.info(`-${name}- Cron Job [${expression}] ${description}`)
  }

  ck.requireDir(`${__dirname}/_cron`, {skip: true})
  cron.befTask((description, expression) => {
    log(`執行`, expression, description)
  }).aftTask((description, expression) => {
    log(`完畢`, expression, description)
  }).run((description, expression) => {
    log(`載入`, expression, description)
  })
})
