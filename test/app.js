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
ck.requireDir(`${specPath}/_library`, {skip: true})
ck.requireDir(`${specPath}/_controller`, {skip: true})
ck.requireDir(`${specPath}/_service`, {skip: true})
ck.requireDir(`${specPath}/_route`, {skip: true})
