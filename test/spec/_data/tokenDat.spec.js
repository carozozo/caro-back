describe(`tokenDat`, () => {
  let tokenDat
  let tokenFak

  before(() => {
    tokenDat = ck.tokenDat
    tokenFak = ck.tokenFak
  })

  describe(`extendExpiredTime`, () => {
    it(`should found null when set days 0`, async () => {
      const where = {username: `extendExpiredTimeUser`}
      await tokenFak.fake(where) // 建立假資料用來測試
      await tokenDat.extendExpiredTime(where, 0)
      const found = await tokenDat.findOne(where)
      assert.isNull(found)
    })
  })
})