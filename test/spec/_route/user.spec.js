const version = ck.APP_VERSION
const group = `user`
const groupPath = ck.api.getGroupPath(group)

describe(groupPath, () => {
  it(`register`, async () => {
    const name = `register`
    const path = `${groupPath}/${name}`
    const sucArr = []
    const errArr = []
    const authMethod = `email`
    const usernameForSuc = `sucUser`
    await (async () => {
      const authMethod = `email`
      const data = ck.userFak.genCreate({username: usernameForSuc})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const result = await ck.poster.post(path, body)
      assert.apiSuc(result)
      sucArr.push(result)
    })()
    // 重複註冊
    await (async () => {
      const data = ck.userFak.genCreate({username: usernameForSuc})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()
    // 沒有輸入帳號
    await (async () => {
      const data = ck.userFak.genCreate({username: undefined})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()
    // 沒有輸入密碼
    await (async () => {
      const data = ck.userFak.genCreate({pwd: undefined})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()
    // 基本資料沒有 email
    await (async () => {
      const data = ck.userFak.genCreate({username: `noEmailUser`})
      const profileData = ck.profileFak.genCreate({name: data.username, email: undefined})
      const body = {data, profileData, authMethod}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()

    ck.apiDoc.outputResultDoc({
      version,
      api: {
        title: `註冊用戶`,
        method: `post`,
        path
      },
      name,
      group,
      param: [
        {type: `string`, field: `authMethod`, desc: `驗證方式`},
        {type: `object`, field: `data`, desc: ``},
        {type: `string`, field: `data.username`, desc: `帳號`},
        {type: `string`, field: `data.pwd`, desc: `密碼`},
        {type: `string`, field: `data.role`, desc: `身份`},
        {type: `object`, field: `profileData`, desc: ``},
        {type: `string`, field: `profileData.name`, desc: `姓名`},
        {type: `string`, field: `profileData.email`, desc: `email`},
        {type: `string`, field: `profileData.phone`, desc: `電話`}
      ],
      use: ck.COMMON_USE
    }, sucArr, errArr)
  })
  it(`login`, async () => {
    const name = `loginUser`
    const path = `${groupPath}/login`
    const sucArr = []
    const errArr = []

    await (async () => {
      const body = {username: `adminTest`, pwd: `adminTest`}
      const result = await ck.poster.post(path, body)
      assert.apiSuc(result)
      sucArr.push(result)
    })()
    // 帳號不存在
    await (async () => {
      const body = {username: `notExists`, pwd: `notExists`}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()
    // 沒輸入密碼
    await (async () => {
      const body = {username: `adminTest`, pwd: ``}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()
    // 密碼錯誤
    await (async () => {
      const body = {username: `adminTest`, pwd: `wrongPwd`}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()

    ck.apiDoc.outputResultDoc({
      version,
      api: {
        title: `用戶登入`,
        method: `post`,
        path
      },
      name,
      group,
      param: [
        {type: `object`, field: `data`, desc: ``},
        {type: `string`, field: `data.username`, desc: `帳號`},
        {type: `string`, field: `data.pwd`, desc: `密碼`}
      ],
      use: ck.COMMON_USE
    }, sucArr, errArr)
  })
  it(`logout`, async () => {
    const name = `logoutUser`
    const path = `${groupPath}/logout`
    const sucArr = []
    const errArr = []

    await (async () => {
      const body = {}
      // 取得最後一個 customer 測試帳號用來登出
      const result = await ck.poster.post(path, body, `customer`, {roleIndex: ck.tester.roleAmount - 1})
      assert.apiSuc(result)
      sucArr.push(result)
    })()
    // 沒有訪問權限
    await (async () => {
      const body = {}
      const result = await ck.poster.post(path, body)
      assert.apiWar(result)
      errArr.push(result)
    })()

    ck.apiDoc.outputResultDoc({
      version,
      api: {
        title: `用戶登出`,
        method: `post`,
        path
      },
      name,
      group,
      param: [],
      use: ck.COMMON_USE
    }, sucArr, errArr)
  })
  it(`updateById`, async () => {
    const name = `updateById`
    const path = `${groupPath}/${name}`
    const data = {}
    const sucArr = []
    const errArr = []

    await (async () => {
      const customer = await ck.tester.getTester()
      const body = {id: customer.id, data}
      const result = await ck.poster.post(path, body, `customer`)
      assert.apiSuc(result)
      sucArr.push(result)
    })()
    // customer 無法更新別人的資料
    await (async () => {
      const stuff = await ck.tester.getTester(`stuff`)
      const body = {id: stuff.id, data}
      const result = await ck.poster.post(path, body, `customer`)
      assert.apiWar(result)
      errArr.push(result)
    })()

    ck.apiDoc.outputResultDoc({
      version,
      api: {
        title: `用 id 更新用戶資料`,
        method: `post`,
        path
      },
      name,
      group,
      param: [
        {type: `id`, field: `id`, desc: `用戶 id`}
      ],
      use: ck.COMMON_USE
    }, sucArr, errArr)
  })
  it(`getById`, async () => {
    const name = `getUserById`
    const user = await ck.userMod.findOne()
    const path = `${groupPath}/getById`
    const query = {id: user.id}
    const queryPath = _.serializeUrl(path, query)
    const sucArr = []
    const errArr = []

    await (async () => {
      for (const role of [`stuff`, `manager`, `admin`]) {
        const result = await ck.poster.get(queryPath, role)
        assert.apiSuc(result)
        if (!sucArr.gotResult) {
          sucArr.gotResult = true
          sucArr.push(result)
        }
      }
    })()
    // customer 無法權限
    await (async () => {
      const result = await ck.poster.get(queryPath, `customer`)
      assert.apiWar(result)
      errArr.push(result)
    })()

    ck.apiDoc.outputResultDoc({
      version,
      api: {
        title: `用 id 取得用戶資料`,
        method: `get`,
        path
      },
      roles: [`stuff`, `manager`, `admin`],
      name,
      group,
      param: [
        {type: `id`, field: `id`, desc: `用戶 id`}
      ],
      use: ck.COMMON_USE
    }, sucArr, errArr)
  })
  it(`getList`, async () => {
    const name = `getList`
    const path = `${groupPath}/${name}`
    const query = {}
    const queryPath = _.serializeUrl(path, query)
    const sucArr = []
    const errArr = []

    await (async () => {
      for (const role of [`stuff`, `manager`, `admin`]) {
        const result = await ck.poster.get(queryPath, role)
        assert.apiSuc(result)
        if (!sucArr.gotResult) {
          sucArr.gotResult = true
          sucArr.push(result)
        }
      }
    })()
    // customer 權限不足
    await (async () => {
      const result = await ck.poster.get(queryPath, `customer`)
      assert.apiWar(result)
      errArr.push(result)
    })()

    ck.apiDoc.outputResultDoc({
      version,
      api: {
        title: `取得用戶列表`,
        method: `get`,
        path
      },
      roles: [`stuff`, `manager`, `admin`],
      name,
      group,
      param: [
        {type: `id`, field: `id`, desc: `用戶 id`}
      ],
      use: ck.COMMON_USE
    }, sucArr, errArr)
  })
})
