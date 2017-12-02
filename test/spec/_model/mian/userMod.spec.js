describe(`userMod`, () => {
  describe(`create`, () => {
    it(`document pwd will not equal to original set`, async () => {
      const pwd = `123`
      const fake = await ck.userFak.fake({pwd})
      const userId = fake.id
      const foundUser = await ck.userMod.findById(userId)
      assert.notEqual(foundUser.pwd, pwd)
    })
    it(`customer`, async () => {
      const data = ck.userFak.genCreate()
      const user = await ck.userMod.create(data)
      assert.equal(user.role, `customer`)
    })
    it(`stuff`, async () => {
      const data = ck.userFak.genCreate({role: `stuff`})
      const user = await ck.userMod.create(data)
      assert.equal(user.role, `stuff`)
    })
    it(`manager`, async () => {
      const data = ck.userFak.genCreate({role: `manager`})
      const user = await ck.userMod.create(data)
      assert.equal(user.role, `manager`)
    })
    it(`admin`, async () => {
      const data = ck.userFak.genCreate({role: `admin`})
      const user = await ck.userMod.create(data)
      assert.equal(user.role, `admin`)
    })
  })

  describe(`update`, () => {
    it(`document pwd will not equal to original set`, async () => {
      const fake = await ck.userFak.fake()
      const userId = fake.id
      const pwd = `123`
      await ck.userMod.updateById(userId, {pwd})
      await ck.userMod.update({id: userId}, {pwd: `444`})
      const foundUser = await ck.userMod.findById(userId)
      assert.notEqual(foundUser.pwd, pwd)
    })
  })

  describe(`remove`, () => {
    it(`should remove token before user removed`, async () => {
      const fake = await ck.userFak.fake()
      const userId = fake.id
      const username = fake.username
      await ck.tokenFak.fake({username})
      await ck.userMod.removeById(userId)
      const tokenCount = await ck.tokenDat.count({username})
      assert.equal(tokenCount, 0)
    })
  })

  describe(`findByUsername`, () => {
    it(async () => {
      const fake = await ck.userFak.fake()
      const username = fake.username
      const found = await ck.userMod.findByUsername(username)
      assert.isNotNull(found)
      assert.equal(found.username, username)
    })
  })

  describe(`ifSamePwd`, () => {
    it(async () => {
      const pwd = `123`
      const fake = await ck.userFak.fake({pwd})
      const isSamePwd = await ck.userMod.ifSamePwd(fake, pwd)
      assert.isTrue(isSamePwd)
    })
    it(`got false by wrong pwd`, async () => {
      const fake = await ck.userFak.fake()
      const isSamePwd = await ck.userMod.ifSamePwd(fake, `wrongPwd`)
      assert.isFalse(isSamePwd)
    })
  })
})
