const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack()

require(`init/setVariable`)
require(`init/setConfig`)
require(`init/setModule`)
require(`boot/connectDb`)

ck.boot.on(`runStacks`, async () => {
  const target = process.env.TARGET || ck.APP_VERSION
  try {
    ck.info(`==========================================`)
    ck.info(`準備載入 migration ${target}`)
    ck.autoRequire(`${__dirname}/${target}`)
    await ck.migration.runStacks()
    ck.info(`migrate 完畢`)
    ck.info(`==========================================`)
    process.exit()
  } catch (e) {
    ck.err(`migrate 發生錯誤:`, e)
    process.exit(1)
  }
}).runStacks()