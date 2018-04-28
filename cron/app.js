const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack()

ck.requireDir(`module`, {level: 0, load: true})
ck.require(`boot/connectDb`)

ck.boot.on(`runStacks`, async () => {
  const cron = ck.cron
  const log = (name, expression, description, result) => {
    if (result) {
      return ck.logger.log(`-${name}- Cron Job [${expression}] ${description}`, result)
    }
    return ck.logger.log(`-${name}- Cron Job [${expression}] ${description}`)
  }

  ck.requireDir(`${__dirname}/task`)
  cron.befTask((description, expression) => {
    log(`執行`, expression, description)
  }).aftTask((result, description, expression) => {
    log(`完畢`, expression, description, result)
  }).onTasking((description, expression) => {
    log(`跳過`, expression, description)
  }).run((description, expression) => {
    log(`載入`, expression, description)
  })
}).runStacks()
