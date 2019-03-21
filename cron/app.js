require(`ck`)

ck.require(`boot/startRedis`)
ck.require(`boot/startMongo`)
ck.require(`boot/startMaria`)

ck.boot.on(`runStacks`, async () => {
  const cron = ck.cron
  const log = (name, taskName, syntax) => {
    const msg = `Cron Job -${name}- ${taskName} [${syntax}]`
    ck.logger.log(msg)
  }

  ck.requireDir(`${__dirname}/task`)
  cron.onLoadTask(({taskName, syntax}) => {
    log(`載入`, taskName, syntax)
  }).befTask(({taskName, syntax}) => {
    log(`執行`, taskName, syntax)
  }).aftTask(({taskName, syntax}) => {
    log(`完畢`, taskName, syntax)
  }).onTasking(({taskName, syntax}) => {
    log(`跳過`, taskName, syntax)
  }).schedule()
}).runStacks()
