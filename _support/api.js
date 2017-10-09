/* 實作 ck.Api 物件 for API Server */
class Api extends ck.Api {
  getGroupPath (group, version = ck.APP_VERSION) {
    return `/api/v${version}/${group}`
  }
}

module.exports = new Api()
