describe(`UserSer`, () => {
  describe(`register`, () => {
    it(`with authMethod = email`, async () => {
      const data = ck.userFake.genCreate()
      const profileData = ck.profileFake.genCreate({name: data.username})
      const authMethod = `email`
      const {user, profile} = await new ck.UserSer().register(data, profileData, authMethod)
      assert.equal(user.name, data.name)
      assert.equal(user.username, data.username)
      assert.isUndefined(user.pwd)
      assert.equal(profile.name, data.username)
    })
    it(`with authMethod = sms`, async () => {
      const data = ck.userFake.genCreate()
      const profileData = ck.profileFake.genCreate({name: data.username})
      const authMethod = `sms`
      const {user, profile} = await new ck.UserSer().register(data, profileData, authMethod)
      assert.equal(user.name, data.name)
      assert.equal(user.username, data.username)
      assert.isUndefined(user.pwd)
      assert.equal(profile.name, data.username)
    })
    it(`error by same username`, async () => {
      const data = ck.userFake.genCreate({username: `sameUser`})
      const profileData = ck.profileFake.genCreate()
      const authMethod = `sms`
      await new ck.UserSer().register(data, profileData, authMethod)
      await assert.shouldGotErr(async () => {
        await new ck.UserSer().register(data, profileData, authMethod)
      })
    })
    it(`error by without authMethod`, async () => {
      const data = ck.userFake.genCreate()
      const profileData = ck.profileFake.genCreate()
      await assert.shouldGotErr(async () => {
        await new ck.UserSer().register(data, profileData)
      })
    })
  })

  describe(`login`, () => {
    it(async () => {
      const result = await new ck.UserSer().login(`admin`, `admin`)
      assert.isObject(result.user)
      assert.isObject(result.token)
    })
    it(`multi login will not create multi token`, async () => {
      await new ck.UserSer().login(`admin`, `admin`)
      await new ck.UserSer().login(`admin`, `admin`)
      const user = await ck.userDat.findByUsername(`admin`)
      const username = user.username
      const tokenLength = await ck.tokenDat.count({username})
      assert.equal(tokenLength, 1)
    })
    it(`error by user not exists`, async () => {
      await assert.shouldGotErr(async () => {
        await new ck.UserSer().login(`notExists`, `1234`)
      })
    })
    it(`error by wrong password`, async () => {
      await assert.shouldGotErr(async () => {
        await new ck.UserSer().login(`admin`, `5678`)
      })
    })
  })

  describe(`logout`, () => {
    it(async () => {
      const username = `admin`
      const loginResult = await new ck.UserSer().login(username, username)
      const userSer = new ck.UserSer(new ck.ReqUser(loginResult.user))
      await userSer.logout()
      const token = await ck.tokenDat.findOne({username})
      assert.isNull(token)
    })
  })

  describe(`getById`, () => {
    it(async () => {
      const one = await ck.userDat.findOne()
      const id = one.id
      const user = await new ck.UserSer().getById(id)
      assert.equal(user.id, id)
      assert.isUndefined(user.pwd)
    })
  })

  describe(`getList`, () => {
    it(async () => {
      const userList = await new ck.UserSer().getList()
      assert.isAtMost(userList.length, 50)
      assert.isUndefined(userList[0].pwd)
    })
    it(`by query username`, async () => {
      const username = `admin`
      const userList = await new ck.UserSer().getList({username})
      assert.isAtLeast(userList.length, 1)
      assert.equal(userList[0].username, username)
    })
    it(`by limit and skip`, async () => {
      const userList = await new ck.UserSer().getList()
      const userListByLimit = await new ck.UserSer().getList({limit: 2})
      assert.equal(userListByLimit.length, 2)

      const secondItem = userList[1]
      const userListBySkip = await new ck.UserSer().getList({offset: 1})
      assert.equal(userListBySkip[0].username, secondItem.username)
    })
  })

  describe(`updateById`, () => {
    it(async () => {
      const reqUser = await ck.tester.getReqUser()
      const id = reqUser.$data.id
      const pwd = `1234`
      const data = {pwd}
      const userSer = new ck.UserSer(reqUser)
      await userSer.updateById(id, data)
      const user = await ck.userDat.findById(id)
      assert.equal(user.id, id)
      assert.isTrue(await ck.userDat.ifSamePwd(user, pwd))
    })
    it(`by roles without customer`, async () => {
      const roleArr = _.pull(ck.config.userRoles, `customer`)
      for (const role of roleArr) {
        const reqUser = await ck.tester.getReqUser(role)
        const one = await ck.userDat.findOne()
        const id = one.id
        const pwd = `1234`
        const data = {pwd}
        await new ck.UserSer(reqUser).updateById(id, data)
        const user = await ck.userDat.findById(id)
        assert.equal(user.id, id)
        assert.isTrue(await ck.userDat.ifSamePwd(user, pwd))
      }
    })
    it(`error by customer try to update another user`, async () => {
      const reqUser = await ck.tester.getReqUser()
      const one = await ck.userDat.findOne()
      const id = one.id
      const pwd = `1234`
      const data = {pwd}
      await assert.shouldGotErr(async () => {
        await new ck.UserSer(reqUser).updateById(id, data)
      })
    })
  })
})
