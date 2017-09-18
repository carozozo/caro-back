// 建立 user 和 profile 資料
ck.runAsync(async () => {
  const userFake = ck.userFake
  const _userArr = []
  const _profileArr = []

  const setProfile = (user) => {
    const username = user.username
    const _profile = ck.profileFake.genCreate({name: username, user_username: username})
    _profileArr.push(_profile)
  }

  for (let i = 0; i < 50; i++) {
    const _user = userFake.genCreate({username: `customer${i + 1}`, role: `customer`})
    _userArr.push(_user)
    setProfile(_user)
  }
  for (let i = 0; i < 10; i++) {
    const _user = userFake.genCreate(userFake.genCreate({username: `stuff${i + 1}`, role: `stuff`}))
    _userArr.push(_user)
    setProfile(_user)
  }
  for (let i = 0; i < 3; i++) {
    const _user = userFake.genCreate(userFake.genCreate({username: `manager${i + 1}`, role: `manager`}))
    _userArr.push(_user)
    setProfile(_user)
  }
  const _user = userFake.genCreate(userFake.genCreate({username: `admin`, role: `admin`}))
  _userArr.push(_user)
  setProfile(_user)

  await ck.userDat.createMany(_userArr)
  await ck.profileDat.createMany(_profileArr)
})