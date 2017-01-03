const CaroBack = require(`ck`)
global.ck = new CaroBack()

require(`init/setVariable`)
require(`init/setConfig`)
require(`init/setModel`)
require(`boot/connectDb`)

ck.boot.runStacks()

ck.boot.on(`runStacks`, async () => {
  const version = process.env.VERSION || ck.APP_VERSION
  try {
    ck.info(`==========================================`)
    ck.info(`準備執行 migration v${version}`)
    ck.requireDir(`${__dirname}/${version}`)
    await ck.migration.runStacks()
    ck.info(`migration v${version} 執行完畢`)
    ck.info(`==========================================`)
    process.exit(0)
  } catch (e) {
    ck.err(`執行 migration v${version} 發生錯誤:`, e)
    process.exit(1)
  }
})