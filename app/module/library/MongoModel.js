/* 客製化 Mongo 資料操作 */
class MongoModel {
  constructor (model) {
    this.model = model
    this._hookMap = {}
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
    for (const key in fns) {
      const fn = fns[key]
      await fn.apply(this, args)
    }
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
    const d = await this.model.create(args[0])
    return d.toJSON()
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
    const list = await this.model.insertMany(args[0], args[1])
    return list.map((d) => d.toJSON())
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
    return this.model.find(args[0], args[1], args[2]).lean().exec()
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
    return this.model.findOne(args[0], args[1], args[2]).lean().exec()
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

  async findById (...args) {
    if (!args[0]) throw Error(`id 為必填`)
    args[0] = {_id: args[0]}
    return this.findOne.apply(this, args)
  }

  async $update (...args) {
    return this.model.updateMany(args[0], args[1], args[2]).lean().exec()
  }

  async update (...args) {
    const triggerName = `update`
    args[0] = args[0] || {}
    await this._triggerBy(`pre`, triggerName, args)
    await this.$update.apply(this, args)
    const result = await this.$find(args[0])
    for (const data of result) {
      const argsForPost = _.clone(args)
      argsForPost.unshift(data)
      await this._triggerBy(`post`, triggerName, argsForPost)
    }
    return result
  }

  async $updateOne (...args) {
    return this.model.findOneAndUpdate(args[0], args[1], args[2]).lean().exec()
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

  async updateById (...args) {
    if (!args[0]) throw Error(`id 為必填`)
    args[0] = {_id: args[0]}
    return this.updateOne.apply(this, args)
  }

  async $remove (...args) {
    return this.model.deleteMany(args[0]).lean().exec()
  }

  async remove (...args) {
    const triggerName = `remove`
    args[0] = args[0] || {}
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
    return this.model.findOneAndRemove(args[0]).lean().exec()
  }

  async removeOne (...args) {
    const triggerName = `remove`
    args[0] = args[0] || {}
    await this._triggerBy(`pre`, triggerName, args)
    const result = await this.$removeOne.apply(this, args)
    if (result) {
      args.unshift(result)
      await this._triggerBy(`post`, triggerName, args)
    }
    return result
  }

  async removeById (...args) {
    if (!args[0]) throw Error(`id 為必填`)
    args[0] = {_id: args[0]}
    return this.removeOne.apply(this, args)
  }

  async $count (...args) {
    return this.model.countDocuments(args[0]).lean().exec()
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

module.exports = MongoModel
