ck.requireDir(`_library`)
ck.requireDir(`_support`)
ck.boot.on(`runStacks`, () => {
  ck.requireDir(`${ck.APP_PATH}/_fakeData`)
  ck.requireDir(`${ck.APP_PATH}/_schema`)
  ck.requireDir(`${ck.APP_PATH}/_data`)
  ck.requireDir(`${ck.APP_PATH}/_service`)
})
