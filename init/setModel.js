ck.autoRequire(`_library`)
ck.autoRequire(`_support`)
ck.boot.on(`runStacks`, () => {
  ck.autoRequire(`${ck.APP_PATH}/_fakeData`)
  ck.autoRequire(`${ck.APP_PATH}/_schema`)
  ck.autoRequire(`${ck.APP_PATH}/_data`)
  ck.autoRequire(`${ck.APP_PATH}/_controller`)
})
