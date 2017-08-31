const CaroBack = require(`ck`)
global.ck = new CaroBack({isWriteLog: true})

require(`init`)
require(`boot`)
require(`./init`)

before(function (done) {
  this.timeout(50000)
  ck.boot.on(`runStacks`, () => {
    ck.poster.setApiUrl(`http://localhost:${ck.api.port}`)
    done()
  })
})

after(function () {
  ck.cacheDb.disconnect()
  ck.analysisDb.disconnect()
  ck.mainDb.disconnect()
})

const specPath = `test/spec`
ck.requireDir(`${specPath}/_library`, {skip: true})
ck.requireDir(`${specPath}/_model`, {skip: true})
ck.requireDir(`${specPath}/_route`, {skip: true})
