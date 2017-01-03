class UserFake {
  constructor () {
    ck.mainDb.stacker.regStack(async () => {
      const fakeProfile = async (user) => {
        const username = user.username
        await ck.profileFake.fake({name: user.username, user_username: username})
      }
      for (let i = 0; i < 50; i++) {
        const user = await this.fake({username: `customer${i + 1}`, role: `customer`})
        await fakeProfile(user)
      }
      for (let i = 0; i < 10; i++) {
        const user = await this.fake({username: `stuff${i + 1}`, role: `stuff`})
        await fakeProfile(user)
      }
      for (let i = 0; i < 3; i++) {
        const user = await this.fake({username: `manager${i + 1}`, role: `manager`})
        await fakeProfile(user)
      }
      const user = await this.fake({username: `admin`, role: `admin`})
      await fakeProfile(user)
    })
  }

  genCreate (data = {}) {
    const role = data.role || `customer`
    let count = this[`_${role}Count`] || 0
    const username = data.username || `${role}${++count}Fake`

    const _data = _.assign({
      username,
      pwd: username,
      role
    }, data)
    this[`_${role}Count`] = count
    return _data
  }

  async fake (data) {
    const _data = this.genCreate(data)
    return ck.userDat.create(_data)
  }
}

module.exports = new UserFake()
