describe(`RedisModel`, () => {
  let testMod
  const createRow = async () => {
    this.count = this.count || 0
    const data = {name: `test${++this.count}`}
    return testMod.create(data)
  }

  before(async () => {
    testMod = new ck.RedisModel(ck.cacheDb.client, `Test`)
  })

  after(async () => {
    await testMod.remove()
  })

  describe(`create`, () => {
    it(async () => {
      const _test = {name: `testCreate`}
      const data = await testMod.create(_test)
      assert.isPlainObject(data)
      assert.isString(data.id)
      assert.equal(data.name, _test.name)
    })
  })

  describe(`find`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(`without where`, async () => {
      const arr = await testMod.find()
      assert.isArray(arr)
    })
    it(`with where`, async () => {
      const arr = await testMod.find({name: `test0`})
      assert.isArray(arr)
    })
    it(`will return empty array when not found`, async () => {
      const arr = await testMod.find({name: `notUser`})
      assert.isArray(arr)
      assert.isEmpty(arr)
    })
  })

  describe(`findOne`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(`without where`, async () => {
      const data = await testMod.findOne()
      assert.isPlainObject(data)
    })
    it(`with where`, async () => {
      const arr = await testMod.find()
      const one = arr[0]
      const data = await testMod.findOne(arr[0])
      assert.isPlainObject(data)
      assert.equal(data.id, one.id)
      assert.equal(data.name, one.name)

    })
    it(`will return null when not found`, async () => {
      const data = await testMod.findOne({name: `notUser`})
      assert.isNull(data)
    })
  })

  describe(`findById`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testMod.findOne()
      const data = await testMod.findById(one.id)
      assert.isPlainObject(data)
      assert.equal(data.id, one.id)
      assert.equal(data.name, one.name)
    })
    it(`will return null when not found`, async () => {
      const data = await testMod.findById(`12345`)
      assert.isNull(data)
    })
  })

  describe(`update`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testMod.findOne()
      const where = {name: one.name}
      const _test = {name: `${where.name}Update`}
      const result = await testMod.update(where, _test)
      // 已經沒有舊資料
      const foundOrigin = await testMod.find(where)
      assert.isEmpty(foundOrigin)
      // update 回傳的資料符合更新後的值
      const foundNew = await testMod.find(_test)
      assert.equal(result.length, foundNew.length)
      _.forEach(foundNew, (found) => {
        assert.equal(found.name, _test.name)
      })
    })
    it(`update all`, async () => {
      const _test = {name: `updateNameForAll`}
      const result = await testMod.update({}, _test)
      const arr = await testMod.find(_test)
      assert.equal(result.length, arr.length)
      _.forEach(arr, (found) => {
        assert.equal(found.name, _test.name)
      })
    })
    it(`will return empty array when not found`, async () => {
      const _test = {name: `nameNotExistsUpdate`}
      const result = await testMod.update({name: `nameNotExists`}, _test)
      const arr = await testMod.find(_test)
      assert.isEmpty(result)
      assert.isEmpty(arr)
    })
  })

  describe(`updateOne`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testMod.findOne()
      const where = {name: one.name}
      const _test = {name: `${where.name}Update`}
      const result = await testMod.updateOne(where, _test)
      // update 回傳的資料符合更新後的值
      const found = await testMod.findOne(_test)
      assert.equal(result.id, found.id)
      assert.equal(found.name, found.name)
    })
    it(`will only update first one when search all`, async () => {
      const _test = {name: `updateOneNameForSearchAll`}
      const result = await testMod.updateOne({}, _test)
      const arr = await testMod.find(_test)
      // update 回傳的資料只有第一筆符合更新後的值
      _.forEach(arr, (found, i) => {
        if (i === 0) assert.equal(found.name, result.name)
        else assert.notEqual(found.name, result.name)
      })
    })
    it(`will return null when not found`, async () => {
      const _test = {name: `nameNotExistsUpdateOne`}
      const result = await testMod.updateOne({name: `nameNotExists`}, _test)
      const arr = await testMod.findOne(_test)
      assert.isNull(result)
      assert.isNull(arr)
    })
  })

  describe(`updateById`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testMod.findOne()
      const _test = {name: `${one.name}Update`}
      const result = await testMod.updateById(one.id, _test)
      // update 回傳的資料符合更新後的值
      const found = await testMod.findOne(_test)
      assert.equal(result.id, found.id)
      assert.equal(found.name, found.name)
    })
    it(`will return null when not found`, async () => {
      const _test = {name: `nameNotExistsUpdateOne`}
      const result = await testMod.updateById(1111, _test)
      const found = await testMod.findOne(_test)
      assert.isNull(result)
      assert.isNull(found)
    })
  })

  describe(`remove`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      await testMod.create({name: `testRemove`})
      await testMod.create({name: `testRemove`})

      const where = {name: `testRemove`}
      const countBefRemove = await testMod.count(where)
      assert.equal(countBefRemove, 2)
      await testMod.remove(where)
      const countAftRemove = await testMod.count(where)
      assert.equal(countAftRemove, 0)
    })
    it(`remove all`, async () => {
      await testMod.remove()
      const arr = await testMod.find()
      assert.isEmpty(arr)
    })
  })

  describe(`removeOne`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      await testMod.create({name: `testRemoveOne`})
      await testMod.create({name: `testRemoveOne`})

      const where = {name: `testRemoveOne`}
      const countBefRemove = await testMod.count(where)
      assert.equal(countBefRemove, 2)
      await testMod.removeOne(where)
      const countAftRemove = await testMod.count(where)
      assert.equal(countAftRemove, countBefRemove - 1)
    })
    it(`will only remove first one when search all`, async () => {
      const where = {}
      const firstOne = await testMod.findOne(where)
      const countBefRemove = await testMod.count(where)
      await testMod.removeOne(where)
      const countAftRemove = await testMod.count(where)
      assert.equal(countAftRemove, countBefRemove - 1)
      // 會移除第一筆資料
      const foundFirstOneAftRemove = await testMod.findOne(firstOne)
      assert.isNull(foundFirstOneAftRemove)
    })
  })

  describe(`removeById`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const countBefRemove = await testMod.count()
      const one = await testMod.findOne()
      const id = one.id
      await testMod.removeById(id)
      const countAftRemove = await testMod.count()
      const found = await testMod.findById(id)
      assert.isNull(found)
      assert.equal(countAftRemove, countBefRemove - 1)
    })
    it(`no one will remove when not found`, async () => {
      const countBefRemove = await testMod.count()
      await testMod.removeById(1111)
      const countAftRemove = await testMod.count()
      assert.equal(countAftRemove, countBefRemove)
    })
  })

  describe(`count`, () => {
    it(async () => {
      await testMod.create({name: `testCount`})
      await testMod.create({name: `testCount`})
      const count = await testMod.count({name: `testCount`})
      assert.equal(count, 2)
    })
  })

  describe(`expired`, () => {
    it(async () => {
      const name = `testExpired`
      await testMod.create({name})
      await testMod.create({name})
      await testMod.expired({name}, 1)
      const count = await testMod.count({name})
      assert.equal(count, 2)
      await ck.unit.waiting(1001)
      const count2 = await testMod.count({name})
      assert.equal(count2, 0)
    })
  })

  describe(`expiredOne`, () => {
    it(async () => {
      const name = `testExpiredOne`
      await testMod.create({name})
      await testMod.create({name})
      await testMod.expiredOne({name}, 1)
      const count = await testMod.count({name})
      assert.equal(count, 2)
      await ck.unit.waiting(1001)
      const count2 = await testMod.count({name})
      assert.equal(count2, 1)
    })
  })

  describe(`expiredById`, () => {
    it(async () => {
      const name = `testExpiredById`
      const test = await testMod.create({name})
      await testMod.expiredById(test, 1)
      const count = await testMod.count({name})
      assert.equal(count, 1)
      await ck.unit.waiting(1001)
      const count2 = await testMod.count({name})
      assert.equal(count2, 1)
    })
  })
})
