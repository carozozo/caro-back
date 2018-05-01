ck.boot.on(`runStacks`, async () => {
  ck.requireDir(`model/schema`, {load: true})
  ck.requireDir(`model`, {load: true})
})
