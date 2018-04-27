const CaroBack = require(`ck`)

global.assert = require(`chai`).assert
global._ = require(`caro`)
global.ck = new CaroBack()

require(`init`)
require(`boot`)
require(`./init`)

before(function (done) {
  ck.boot.on(`runStacks`, () => {
    ck.poster.setApiUrl(`http://localhost:${ck.api.port}`)
    done()
  })
})

after(function () {
  ck.cacheDb.disconnect()
  ck.logDb.disconnect()
  ck.mainDb.disconnect()
})

const specPath = `test/spec`
ck.requireDir(`${specPath}/library`, {skip: true})
ck.requireDir(`${specPath}/model`, {skip: true})
ck.requireDir(`${specPath}/controller`, {skip: true})
ck.requireDir(`${specPath}/service`, {skip: true})
ck.requireDir(`${specPath}/route`, {skip: true})
