const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack({isWriteLog: true})

require(`init/setVariable`)
require(`init/setConfig`)
require(`init/setModule`)
require(`boot/connectDb`)

ck.boot.on(`runStacks`, async () => {
  if (!ck.IS_FIRST_PROCESS) return
  ck.createLog(`cron`)   // 建立一個叫 cron 的 log
  const cron = ck.cron
  const log = (name, expression, description, result) => {
    if (result) {
      return ck.log.cron(`-${name}- Cron Job [${expression}] ${description}`, result)
    }
    return ck.log.cron(`-${name}- Cron Job [${expression}] ${description}`)
  }

  ck.autoRequire(`${__dirname}/task`, {skip: true})
  cron.befTask((description, expression) => {
    log(`執行`, expression, description)
  }).aftTask((result, description, expression) => {
    log(`完畢`, expression, description,result)
  }).onTasking((description, expression) => {
    log(`跳過`, expression, description)
  }).run((description, expression) => {
    log(`載入`, expression, description)
  })
}).runStacks()