ck.boot.on(`runStacks`, async () => {
  ck.requireDir(`app/model/schema`, {load: true})
  ck.requireDir(`app/model`, {load: true})
})
