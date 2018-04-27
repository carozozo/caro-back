const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack()

require(`init/setVariable`)
require(`init/setConfig`)
require(`init/setModule`)
require(`boot/connectDb`)

ck.boot.on(`runStacks`, async () => {
  const target = process.env.TARGET || require(`package.json`).version
  try {
    ck.logger.log(`==========================================`)
    ck.logger.log(`準備載入 migration ${target}`)
    ck.requireDir(`${__dirname}/${target}`)
    await ck.migration.runStacks()
    ck.logger.log(`migrate 完畢`)
    ck.logger.log(`==========================================`)
    process.exit()
  } catch (e) {
    ck.logger.err(`migrate 發生錯誤:`, e)
    process.exit(1)
  }
}).runStacks()