const group = `user`
const groupPath = ck.apiServer.getGroupPath(group)

describe(groupPath, () => {
  it(`register`, async () => {
    const name = `register`
    const path = `${groupPath}/${name}`
    const sucArr = []
    const errArr = []
    const authMethod = `email`
    const usernameForSuc = `sucUser`

    await (async () => {
      const role = ``
      const desc = `註冊成功`
      const authMethod = `email`
      const data = ck.userFak.genCreate({username: usernameForSuc})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const response = await ck.poster.post(path, body)
      assert.apiSuc(response)
      sucArr.push({desc, body, response, role})
    })()

    await (async () => {
      const role = ``
      const desc = `重複註冊`
      const data = ck.userFak.genCreate({username: usernameForSuc})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()
    await (async () => {
      const role = ``
      const desc = `沒有輸入帳號`
      const data = ck.userFak.genCreate({username: undefined})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()
    await (async () => {
      const role = ``
      const desc = `沒有輸入密碼`
      const data = ck.userFak.genCreate({pwd: undefined})
      const profileData = ck.profileFak.genCreate({name: data.username})
      const body = {data, profileData, authMethod}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()
    await (async () => {
      const role = ``
      const desc = `基本資料沒有 email`
      const data = ck.userFak.genCreate({username: `noEmailUser`})
      const profileData = ck.profileFak.genCreate({name: data.username, email: undefined})
      const body = {data, profileData, authMethod}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()

    ck.apiDoc.outputResultDoc({
      api: {
        title: `註冊用戶`,
        method: `post`,
        path
      },
      name,
      group,
      header: [
        {type: `string`, field: `authMethod`, desc: `驗證方式`},
      ],
      bodyParam: [
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
    }, sucArr, errArr)
  })
  it(`login`, async () => {
    const name = `loginUser`
    const path = `${groupPath}/login`
    const sucArr = []
    const errArr = []

    await (async () => {
      const role = ``
      const desc = `登入成功`
      const body = {username: `adminTest`, pwd: `adminTest`}
      const response = await ck.poster.post(path, body)
      assert.apiSuc(response)
      sucArr.push({desc, body, response, role})
    })()

    await (async () => {
      const role = ``
      const desc = `帳號不存在`
      const body = {username: `notExists`, pwd: `notExists`}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()
    await (async () => {
      const role = ``
      const desc = `沒輸入密碼`
      const body = {username: `adminTest`, pwd: ``}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()
    await (async () => {
      const role = ``
      const desc = `密碼錯誤`
      const body = {username: `adminTest`, pwd: `wrongPwd`}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()

    ck.apiDoc.outputResultDoc({
      api: {
        title: `用戶登入`,
        method: `post`,
        path
      },
      name,
      group,
      bodyParam: [
        {type: `string`, field: `username`, desc: `帳號`},
        {type: `string`, field: `pwd`, desc: `密碼`}
      ],
      use: ck.apiDoc.commonHeaderUse
    }, sucArr, errArr)
  })
  it(`logout`, async () => {
    const name = `logoutUser`
    const path = `${groupPath}/logout`
    const sucArr = []
    const errArr = []

    await (async () => {
      const role = `customer`
      const desc = ``
      const body = {}
      // 取得最後一個 customer 測試帳號用來登出
      const response = await ck.poster.post(path, body, role, {roleIndex: ck.tester.roleAmount - 1})
      assert.apiSuc(response)
      sucArr.push({desc, body, response, role})
    })()

    await (async () => {
      const role = ``
      const desc = `沒有訪問權限`
      const body = {}
      const response = await ck.poster.post(path, body)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()

    ck.apiDoc.outputResultDoc({
      api: {
        title: `用戶登出`,
        method: `post`,
        path
      },
      name,
      group,
      use: ck.apiDoc.commonHeaderUse
    }, sucArr, errArr)
  })
  it(`updateById`, async () => {
    const name = `updateById`
    const path = `${groupPath}/${name}`
    const data = {}
    const sucArr = []
    const errArr = []

    await (async () => {
      const role = `customer`
      const desc = `更新成功`
      const customer = await ck.tester.getTester()
      const body = {id: customer.id, data}
      const response = await ck.poster.post(path, body, role)
      assert.apiSuc(response)
      sucArr.push({desc, body, response, role})
    })()

    await (async () => {
      const role = `customer`
      const desc = `customer 無法更新別人的資料`
      const staff = await ck.tester.getTester(`staff`)
      const body = {id: staff.id, data}
      const response = await ck.poster.post(path, body, role)
      assert.apiWar(response)
      errArr.push({desc, body, response, role})
    })()

    ck.apiDoc.outputResultDoc({
      api: {
        title: `用 id 更新用戶資料`,
        method: `post`,
        path
      },
      name,
      group,
      bodyParam: [
        {type: `id`, field: `id`, desc: `用戶 id`},
        {type: `object`, field: `data`, desc: ``},
        {type: `string`, field: `data.username`, desc: `帳號`},
        {type: `string`, field: `data.pwd`, desc: `密碼`},
      ],
      use: ck.apiDoc.commonHeaderUse
    }, sucArr, errArr)
  })
  it(`getById`, async () => {
    const name = `getUserById`
    const user = await ck.userMod.findOne()
    const path = `${groupPath}/getById`
    const sucArr = []
    const errArr = []

    await (async () => {
      const role = `staff`
      const desc = `參數 attributes 指定抓取出來的資料欄位`
      const query = {id: user.id, attributes: `id,username`}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()
    await (async () => {
      const role = `manager`
      const desc = `參數 includes 指定附加資料`
      const query = {id: user.id, includes: `profile`}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()
    await (async () => {
      const role = `admin`
      const desc = `參數 includes 指定附加資料, 並指定附加資料的欄位`
      const query = {id: user.id, includes: `profile-name,phone`}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()

    await (async () => {
      const role = `customer`
      const desc = `customer 無權限`
      const query = {id: user.id}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiWar(response)
      errArr.push({desc, queryPath, response, role})
    })()

    ck.apiDoc.outputResultDoc({
      api: {
        title: `用 id 取得用戶資料`,
        method: `get`,
        path
      },
      roles: [`staff`, `manager`, `admin`],
      name,
      group,
      queryParam: ck.apiDoc.genOptForQueryOneParam(`profile`, [
        {type: `id`, field: `id`, desc: `用戶 id`}
      ]),
      use: ck.apiDoc.commonHeaderUse
    }, sucArr, errArr)
  })
  it(`getList`, async () => {
    const name = `getList`
    const path = `${groupPath}/${name}`
    const sucArr = []
    const errArr = []

    await (async () => {
      const role = `staff`
      const desc = `一般的參數 offset limit`
      const query = {offset: 0, limit: 2}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()
    await (async () => {
      const role = `manager`
      const desc = `參數 attributes 指定抓取出來的資料欄位`
      const query = {offset: 0, limit: 2, attributes: `id,username`}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()
    await (async () => {
      const role = `admin`
      const desc = `參數 includes 指定附加資料`
      const query = {offset: 0, limit: 2, includes: `profile`}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()
    await (async () => {
      const role = `admin`
      const desc = `參數 includes 指定附加資料, 並指定附加資料的欄位`
      const query = {offset: 0, limit: 2, includes: `profile-name,phone`}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiSuc(response)
      sucArr.push({desc, queryPath, response, role})
    })()

    await (async () => {
      const role = `customer`
      const desc = `customer 無權限`
      const query = {}
      const queryPath = _.serializeUrl(path, query)
      const response = await ck.poster.get(queryPath, role)
      assert.apiWar(response)
      errArr.push({desc, queryPath, response, role})
    })()

    ck.apiDoc.outputResultDoc({
      api: {
        title: `取得用戶列表`,
        method: `get`,
        path
      },
      roles: [`staff`, `manager`, `admin`],
      name,
      group,
      queryParam: ck.apiDoc.genOptForQueryListParam(`profile`),
      use: ck.apiDoc.commonHeaderUse
    }, sucArr, errArr)
  })
})
