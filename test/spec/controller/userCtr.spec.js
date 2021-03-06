describe(`userCtr`, () => {
  describe(`register`, () => {
    it(`with authMethod = email`, async () => {
      const data = ck.userFak.genCreate()
      const profileData = ck.profileFak.genCreate({name: data.username})
      const authMethod = `email`
      const {user, profile} = await ck.userCtr.register(data, profileData, authMethod)
      assert.equal(user.name, data.name)
      assert.equal(user.username, data.username)
      assert.isUndefined(user.pwd)
      assert.equal(profile.name, data.username)
    })
    it(`with authMethod = sms`, async () => {
      const data = ck.userFak.genCreate()
      const profileData = ck.profileFak.genCreate({name: data.username})
      const authMethod = `sms`
      const {user, profile} = await ck.userCtr.register(data, profileData, authMethod)
      assert.equal(user.name, data.name)
      assert.equal(user.username, data.username)
      assert.isUndefined(user.pwd)
      assert.equal(profile.name, data.username)
    })
    it(`error by same username`, async () => {
      const data = ck.userFak.genCreate({username: `sameUser`})
      const profileData = ck.profileFak.genCreate()
      const authMethod = `sms`
      await ck.userCtr.register(data, profileData, authMethod)
      await assert.shouldGotErr(async () => {
        await ck.userCtr.register(data, profileData, authMethod)
      })
    })
    it(`error by without authMethod`, async () => {
      const data = ck.userFak.genCreate()
      const profileData = ck.profileFak.genCreate()
      await assert.shouldGotErr(async () => {
        await ck.userCtr.register(data, profileData)
      })
    })
  })

  describe(`login`, () => {
    it(async () => {
      const result = await ck.userCtr.login(`admin`, `admin`)
      assert.isObject(result.user)
      assert.isObject(result.token)
    })
    it(`multi login will not create multi token`, async () => {
      await ck.userCtr.login(`admin`, `admin`)
      await ck.userCtr.login(`admin`, `admin`)
      const user = await ck.userMod.findByUsername(`admin`)
      const username = user.username
      const tokenLength = await ck.tokenMod.count({username})
      assert.equal(tokenLength, 1)
    })
    it(`error by user not exists`, async () => {
      await assert.shouldGotErr(async () => {
        await ck.userCtr.login(`notExists`, `1234`)
      })
    })
    it(`error by wrong password`, async () => {
      await assert.shouldGotErr(async () => {
        await ck.userCtr.login(`admin`, `5678`)
      })
    })
  })

  describe(`logout`, () => {
    it(async () => {
      const user = await ck.userMod.findByUsername(`admin`)
      const reqCustomer = new ck.ReqUser(user)
      const username = reqCustomer.username
      await ck.userCtr.login(username, username)

      await ck.userCtr.logout(reqCustomer)
      const token = await ck.tokenMod.findOne({username})
      assert.isNull(token)
    })
  })

  describe(`updateById`, () => {
    it(async () => {
      const $customer = await ck.tester.getTester()
      const id = $customer.id
      const pwd = `1234`
      const data = {pwd}
      const reqUser = new ck.ReqUser($customer)
      await ck.userCtr.updateById(reqUser, id, data)
      const user = await ck.userMod.findById(id)
      assert.equal(user.id, id)
      assert.isTrue(await ck.userMod.ifSamePwd(user, pwd))
    })
    it(`should got error when customer want edit data of other one`, async () => {
      const reqCustomer = await ck.tester.getReqUser()
      const reqCustomer2 = await ck.tester.getReqUser(`customer`, 2)
      const id = reqCustomer2.id
      const pwd = `1234`
      const data = {pwd}
      const reqUser = new ck.ReqUser(reqCustomer)
      assert.shouldGotErr(async () => {
        await ck.userCtr.updateById(reqUser, id, data)
      })
    })
  })

  describe(`getById`, () => {
    it(async () => {
      const one = await ck.userMod.findOne()
      const id = one.id
      const user = await ck.userCtr.getById(id)
      assert.equal(user.id, id)
      assert.isUndefined(user.pwd)
    })
  })

  describe(`getList`, () => {
    it(async () => {
      const userList = await ck.userCtr.getList()
      assert.isAtMost(userList.length, 50)
      assert.isUndefined(userList[0].pwd)
    })
    it(`by query username`, async () => {
      const username = `admin`
      const userList = await ck.userCtr.getList({username})
      assert.isAtLeast(userList.length, 1)
      assert.isTrue(userList[0].username.includes(username))
    })
    it(`by limit and offset`, async () => {
      const userList = await ck.userCtr.getList()
      const userListByLimit = await ck.userCtr.getList({}, {limit: 2})
      assert.equal(userListByLimit.length, 2)

      const secondItem = userList[1]
      const userListBySkip = await ck.userCtr.getList({}, {offset: 1})
      assert.equal(userListBySkip[0].username, secondItem.username)
    })
  })
})
