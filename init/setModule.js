ck.requireDir(`app/_library`)
ck.requireDir(`app/_support`)
ck.boot.on(`runStacks`, () => {
  ck.requireDir(`app/_fakeData`)
  ck.requireDir(`app/_schema`)
  ck.requireDir(`app/_model`)
  ck.requireDir(`app/_controller`)
})
