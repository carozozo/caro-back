/* 客製化 Sequelize 資料操作 */
class SequelizeData {
  constructor (model) {
    this.model = model
    this._hookMap = {}
  }

  _genWhereForOpt (where = {}, opt = {}) {
    opt.where = where
    return opt
  }

  _getHook (fnName) {
    const hookMap = this._hookMap
    const hook = hookMap[fnName] = hookMap[fnName] || {}
    hook.pre = hook.pre || []
    hook.post = hook.post || []
    return hook
  }

  async _triggerBy (triggerMethod, fnName, args) {
    const hook = this._getHook(fnName)
    const fns = hook[triggerMethod]
    let gotFalse = false
    for (const key in fns) {
      const fn = fns[key]
      const result = await fn.apply(this, args)
      if (result === false) gotFalse = true
    }
    return gotFalse
  }

  pre (fnName, fn) {
    if (!fnName) throw Error(`請輸入 fnName`)
    if (!fn) throw Error(`請輸入 fn`)
    const hook = this._getHook(fnName)
    hook.pre.push(fn)
    return this
  }

  post (fnName, fn) {
    if (!fnName) throw Error(`請輸入 fnName`)
    if (!fn) throw Error(`請輸入 fn`)
    const hook = this._getHook(fnName)
    hook.post.push(fn)
    return this
  }

  async $create (...args) {
    const one = await this.model.create(args[0], args[1])
    if (one) return one.get({plain: true})
    return one
  }

  async create (...args) {
    const triggerName = `create`
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$create.apply(this, args)
    args.unshift(result)
    await this._triggerBy(`post`, triggerName, args)
    return result
  }

  async $createMany (...args) {
    const result = await this.model.bulkCreate(args[0], args[1])
    return _.map(result, (d) => {
      return d.get({plain: true})
    })
  }

  async createMany (...args) {
    const triggerName = `create`
    const dataArrForCreate = args[0]
    for (let i = 0; i < dataArrForCreate.length; i++) {
      const argsForPre = _.clone(args)
      argsForPre[0] = dataArrForCreate[i]
      await this._triggerBy(`pre`, triggerName, argsForPre)
    }
    const result = await this.$createMany.apply(this, args)
    for (const data of result) {
      const argsForPost = _.clone(args)
      argsForPost.unshift(data)
      await this._triggerBy(`post`, triggerName, argsForPost)
    }
    return result
  }

  async $find (...args) {
    const opt = this._genWhereForOpt(args[0], args[1])
    const result = await this.model.findAll(opt)
    return _.map(result, (d) => {
      return d.get({plain: true})
    })
  }

  async find (...args) {
    const triggerName = `find`
    args[0] = args[0] || {}
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$find.apply(this, args)
    for (const data of result) {
      const argsForPost = _.clone(args)
      argsForPost.unshift(data)
      await this._triggerBy(`post`, triggerName, argsForPost)
    }
    return result
  }

  async $findOne (...args) {
    const result = await this.$find.apply(this, args)
    return result[0] || null
  }

  async findOne (...args) {
    const triggerName = `find`
    args[0] = args[0] || {}
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$findOne.apply(this, args)
    if (result) {
      args.unshift(result)
      await this._triggerBy(`post`, triggerName, args)
    }
    return result
  }

  async $findById (...args) {
    args[0] = {id: args[0]}
    return this.$findOne.apply(this, args)
  }

  async findById (...args) {
    args[0] = {id: args[0]}
    return this.findOne.apply(this, args)
  }

  async $update (...args) {
    const values = args[1]
    const opt = this._genWhereForOpt(args[0], args[2])
    await this.model.update(values, opt)
    return this.$find(args[0])
  }

  async update (...args) {
    const triggerName = `update`
    args[0] = args[0] || {}
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$update.apply(this, args)
    for (const data of result) {
      const argsForPost = _.clone(args)
      argsForPost.unshift(data)
      await this._triggerBy(`post`, triggerName, argsForPost)
    }
    return result
  }

  async $updateOne (...args) {
    const one = await this.$findOne(args[0])
    if (!one) return one
    const result = await this.$update.apply(this, args)
    return result[0]
  }

  async updateOne (...args) {
    const triggerName = `update`
    args[0] = args[0] || {}
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$updateOne.apply(this, args)
    if (result) {
      args.unshift(result)
      await this._triggerBy(`post`, triggerName, args)
    }
    return result
  }

  async $updateById (...args) {
    args[0] = {id: args[0]}
    return this.$updateOne.apply(this, args)
  }

  async updateById (...args) {
    args[0] = {id: args[0]}
    return this.updateOne.apply(this, args)
  }

  async $remove (...args) {
    const opt = this._genWhereForOpt(args[0], args[1])
    const result = await this.$find(args[0])
    await this.model.destroy(opt)
    return result
  }

  async remove (...args) {
    const triggerName = `remove`
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$find(args[0])
    await this.$remove.apply(this, args)
    for (const data of result) {
      const argsForPost = _.clone(args)
      argsForPost.unshift(data)
      await this._triggerBy(`post`, triggerName, argsForPost)
    }
    return result
  }

  async $removeOne (...args) {
    const one = await this.$findOne(args[0])
    if (!one) return one
    const result = await this.$remove.apply(this, args)
    return result[0]
  }

  async removeOne (...args) {
    const triggerName = `remove`
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$removeOne.apply(this, args)
    if (result) {
      args.unshift(result)
      await this._triggerBy(`post`, triggerName, args)
    }
    return result
  }

  async $removeById (...args) {
    args[0] = {id: args[0]}
    return this.$removeOne.apply(this, args)
  }

  async removeById (...args) {
    args[0] = {id: args[0]}
    return this.removeOne.apply(this, args)
  }

  async $count (...args) {
    const opt = this._genWhereForOpt(args[0])
    return this.model.count(opt)
  }

  async count (...args) {
    const triggerName = `count`
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$count.apply(this, args)
    args.unshift(result)
    await this._triggerBy(`post`, triggerName, args)
    return result
  }
}

module.exports = SequelizeData
