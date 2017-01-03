class Api extends ck.Api {
  getGroupPath (group, version = ck.APP_VERSION) {
    return `/api/v${version}/${group}`
  }
}

module.exports = new Api()
