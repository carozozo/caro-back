/* 提供測試用 User Id 和 Token Id */
class TesterData {
  constructor () {
    // 每個 role 都會有 ${this._roleAmount} 組 userIds 和 tokenIds
    const roleAmount = this.roleAmount
    const tokenIdPrefix = `596b7a06f6f4e33afe5dd`
    const userRoles = ck.config.userRoles
    let userIndex = 10001
    for (let i in userRoles) {
      const role = userRoles[i]
      this[`_${role}Arr`] = []
      for (let j = i * roleAmount + 1; j <= i * roleAmount + roleAmount; j++) {
        const userId = userIndex++
        const tokenId = `${tokenIdPrefix}${_.padStart(j, 3, `0`)}`
        // this._adminArr = [{userId: `10001`, tokenId: `596b7a06f6f4e33afe5dd001`}]
        this[`_${role}Arr`].push({userId, tokenId})
      }
    }
  }

  // 取得每個 role 的測試帳號數量
  get roleAmount () {
    return 20
  }

  getMapByRole (role, i = 0) {
    const map = this[`_${role}Arr`]
    if (!map) throw Error(`指定的 role ${role} 不存在`)
    if (!map[i]) throw Error(`指定的 role ${role} index ${i} 不存在`)
    return map[i]
  }
}

/* 提供測試用戶 functions */
class Tester extends TesterData {
  _genTesterUsername (role, i = 0) {
    // e.g. adminTest, adminTest2 ...
    return `${role}Test${i === 0 ? `` : i + 1}`
  }

  // 設置多組已經登入的測試用戶
  async setTesters () {
    const userDataArr = []
    const profileDataArr = []
    // 每個 role 建立 ${this.roleAmount} 個已登入的 users
    for (const role of ck.config.userRoles) {
      for (let i = 0; i < this.roleAmount; i++) {
        const username = this._genTesterUsername(role, i)
        const roleMap = this.getMapByRole(role, i)
        const userId = roleMap.userId
        const tokenId = roleMap.tokenId
        const userData = ck.userFake.genCreate({id: userId, username, pwd: username, role})
        const profileData = ck.profileFake.genCreate({name: username, user_username: username})
        const tokenData = ck.tokenFake.genCreate({id: tokenId, username})
        userDataArr.push(userData)
        profileDataArr.push(profileData)
        await ck.tokenDat.create(tokenData)
      }
    }
    await ck.userDat.createMany(userDataArr)
    await ck.profileDat.createMany(profileDataArr)
  }

  // 取得測試用戶
  async getTester (role = `customer`, i) {
    const username = this._genTesterUsername(role, i)
    return ck.userDat.findByUsername(username)
  }

  // 取得用 ReqUser 包裝後的測試用戶
  async getReqUser (role, i) {
    const tester = await this.getTester(role, i)
    return new ck.ReqUser(tester)
  }
}

module.exports = new Tester()
