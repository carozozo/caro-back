/* 放置一些通用但無分類的函式 */
class Unit {
  get workerIndex () {
    return parseInt(process.env.WORKER_INDEX || 0, 10)
  }

  get isFirstProcess () {
    return this.workerIndex === 0
  }

  get canDropDb () {
    const env = process.env.NODE_ENV
    return this.isFirstProcess && (env === `dev` || env === `beta`)
  }

  // 讓程序可以暫停 ms 後才繼續執行
  async waiting (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  toArrayIfString (arg, splitter = `,`) {
    if (_.isString(arg)) return _.split(arg, splitter)
    return arg
  }

  genOptForQueryMaria ({attributes, includes, offset = 0, limit = 50} = {}) {
    const opt = {}

    if (attributes) opt.attributes = this.toArrayIfString(attributes)
    if (includes) {
      // e.g. includes = `profile` => 找出 profile 關聯資料
      // e.g. includes = `profile;info` => 找出 profile 和 info 關聯資料
      // e.g. includes = `profile-name` => 找出 profile 關聯資料, 並過濾出 profile.name
      includes = this.toArrayIfString(includes, `;`)

      opt.include = []
      _.forEach(includes, (i) => {
        const arr = i.split(`-`)
        const modelName = arr[0]
        let attributesOfIncludeModel = arr[1]

        const mod = ck[`${modelName}Mod`]
        if (!mod) throw Error(`關聯資料 ${modelName} 不存在`)

        const includeParam = {
          model: mod.model,
        }
        if (attributesOfIncludeModel) {
          includeParam.attributes = this.toArrayIfString(attributesOfIncludeModel)
        }

        opt.include.push(includeParam)
      })
    }

    if (offset) opt.offset = parseInt(offset, 10)
    if (limit) opt.limit = parseInt(limit, 10)
    return opt
  }
}

module.exports = new Unit()
