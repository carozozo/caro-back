const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack({isWriteLog: true})

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
  ck.analysisDb.disconnect()
  ck.mainDb.disconnect()
})

const specPath = `test/spec`
ck.autoRequire(`${specPath}/_library`, {skip: true})
ck.autoRequire(`${specPath}/_data`, {skip: true})
ck.autoRequire(`${specPath}/_controller`, {skip: true})
ck.autoRequire(`${specPath}/_service`, {skip: true})
ck.autoRequire(`${specPath}/_route`, {skip: true})
