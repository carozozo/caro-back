describe(`tokenMod`, () => {
  describe(`extendExpiredTime`, () => {
    it(`should found null when set days 0`, async () => {
      const where = {username: `extendExpiredTimeUser`}
      await ck.tokenFak.fake(where) // 建立假資料用來測試
      await ck.tokenMod.extendExpiredTime(where, 0)
      const found = await ck.tokenMod.findOne(where)
      assert.isNull(found)
    })
  })
})
