const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack({isWriteLog: true})

require(`init/setVariable`)
require(`init/setConfig`)
require(`init/setModel`)
require(`boot/connectDb`)

ck.boot.on(`runStacks`, async () => {
  if (!ck.IS_FIRST_PROCESS) return
  const cron = ck.cron

  const log = (name, expression, description) => {
    ck.info(`-${name}- Cron Job [${expression}] ${description}`)
  }

  ck.requireDir(`${__dirname}/task`, {skip: true})
  cron.befTask((description, expression) => {
    log(`執行`, expression, description)
  }).aftTask((description, expression) => {
    log(`完畢`, expression, description)
  }).onTasking((description, expression) => {
    log(`跳過`, expression, description)
  }).run((description, expression) => {
    log(`載入`, expression, description)
  })
}).runStacks()