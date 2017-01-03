describe(`userDat`, () => {
  describe(`create`, () => {
    it(`document pwd will not equal to original set`, async () => {
      const pwd = `123`
      const fake = await ck.userFake.fake({pwd})
      const userId = fake.id
      const foundUser = await ck.userDat.findById(userId)
      assert.notEqual(foundUser.pwd, pwd)
    })
    it(`customer`, async () => {
      const data = ck.userFake.genCreate()
      const user = await ck.userDat.create(data)
      assert.equal(user.role, `customer`)
    })
    it(`stuff`, async () => {
      const data = ck.userFake.genCreate({role: `stuff`})
      const user = await ck.userDat.create(data)
      assert.equal(user.role, `stuff`)
    })
    it(`manager`, async () => {
      const data = ck.userFake.genCreate({role: `manager`})
      const user = await ck.userDat.create(data)
      assert.equal(user.role, `manager`)
    })
    it(`admin`, async () => {
      const data = ck.userFake.genCreate({role: `admin`})
      const user = await ck.userDat.create(data)
      assert.equal(user.role, `admin`)
    })
  })

  describe(`update`, () => {
    it(`document pwd will not equal to original set`, async () => {
      const fake = await ck.userFake.fake()
      const userId = fake.id
      const pwd = `123`
      await ck.userDat.updateById(userId, {pwd})
      await ck.userDat.update({id: userId}, {pwd: `444`})
      const foundUser = await ck.userDat.findById(userId)
      assert.notEqual(foundUser.pwd, pwd)
    })
  })

  describe(`remove`, () => {
    it(`should remove token before user removed`, async () => {
      const fake = await ck.userFake.fake()
      const userId = fake.id
      const username = fake.username
      await ck.tokenFake.fake({username})
      await ck.userDat.removeById(userId)
      const tokenCount = await ck.tokenDat.count({username})
      assert.equal(tokenCount, 0)
    })
  })

  describe(`findByUsername`, () => {
    it(async () => {
      const fake = await ck.userFake.fake()
      const username = fake.username
      const found = await ck.userDat.findByUsername(username)
      assert.isNotNull(found)
      assert.equal(found.username, username)
    })
  })

  describe(`ifSamePwd`, () => {
    it(async () => {
      const pwd = `123`
      const fake = await ck.userFake.fake({pwd})
      const isSamePwd = await ck.userDat.ifSamePwd(fake, pwd)
      assert.isTrue(isSamePwd)
    })
    it(`got false by wrong pwd`, async () => {
      const fake = await ck.userFake.fake()
      const isSamePwd = await ck.userDat.ifSamePwd(fake, `wrongPwd`)
      assert.isFalse(isSamePwd)
    })
  })
})
