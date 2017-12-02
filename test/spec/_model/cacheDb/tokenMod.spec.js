describe(`tokenMod`, () => {
  let tokenMod
  let tokenFak

  before(() => {
    tokenMod = ck.tokenMod
    tokenFak = ck.tokenFak
  })

  describe(`extendExpiredTime`, () => {
    it(`should found null when set days 0`, async () => {
      const where = {username: `extendExpiredTimeUser`}
      await tokenFak.fake(where) // 建立假資料用來測試
      await tokenMod.extendExpiredTime(where, 0)
      const found = await tokenMod.findOne(where)
      assert.isNull(found)
    })
  })
})
