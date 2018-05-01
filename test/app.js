require(`ck`)

global.assert = require(`chai`).assert

ck.requireDir(`route`, {level: 0})
require(`boot`)
ck.requireDir(`./init`)

before(function (done) {
  ck.boot.on(`runStacks`, () => {
    ck.poster.setApiUrl(`http://localhost:${ck.api.port}`)
    done()
  }).runStacks()
})

after(function () {
  ck.cacheDb.disconnect()
  ck.logDb.disconnect()
  ck.mainDb.disconnect()
})

const specPath = `test/spec`
ck.requireDir(`${specPath}/library`)
ck.requireDir(`${specPath}/model`)
ck.requireDir(`${specPath}/controller`)
ck.requireDir(`${specPath}/service`)
ck.requireDir(`${specPath}/route`)
