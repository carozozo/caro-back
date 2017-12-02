describe(`RedisModel`, () => {
  let testDat
  const createRow = async () => {
    this.count = this.count || 0
    const data = {name: `test${++this.count}`}
    return testDat.create(data)
  }

  before(async () => {
    const keys = [`name`]
    testDat = new ck.RedisModel(ck.cacheDb.client, `Test`, keys)
    for (let i = 0; i < 5; i++) {
      await createRow(i)
    }
  })

  after(async () => {
    // TODO
    // await testDat.remove()
  })

  describe(`create`, () => {
    it(async () => {
      const _test = {name: `testCreate`}
      const data = await testDat.create(_test)
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
      const arr = await testDat.find()
      assert.isArray(arr)
    })
    it(`with where`, async () => {
      const arr = await testDat.find({name: `test0`})
      assert.isArray(arr)
    })
    it(`will return empty array when not found`, async () => {
      const arr = await testDat.find({name: `notUser`})
      assert.isArray(arr)
      assert.isEmpty(arr)
    })
  })

  describe(`findOne`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(`without where`, async () => {
      const data = await testDat.findOne()
      assert.isPlainObject(data)
    })
    it(`with where`, async () => {
      const arr = await testDat.find()
      const one = arr[0]
      const data = await testDat.findOne(arr[0])
      assert.isPlainObject(data)
      assert.equal(data.id, one.id)
      assert.equal(data.name, one.name)

    })
    it(`will return null when not found`, async () => {
      const data = await testDat.findOne({name: `notUser`})
      assert.isNull(data)
    })
  })

  describe(`findById`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testDat.findOne()
      const data = await testDat.findById(one.id)
      assert.isPlainObject(data)
      assert.equal(data.id, one.id)
      assert.equal(data.name, one.name)
    })
    it(`will return null when not found`, async () => {
      const data = await testDat.findById(`12345`)
      assert.isNull(data)
    })
  })

  describe(`update`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testDat.findOne()
      const where = {name: one.name}
      const _test = {name: `${where.name}Update`}
      const result = await testDat.update(where, _test)
      // 已經沒有舊資料
      const foundOrigin = await testDat.find(where)
      assert.isEmpty(foundOrigin)
      // update 回傳的資料符合更新後的值
      const foundNew = await testDat.find(_test)
      assert.equal(result.length, foundNew.length)
      _.forEach(foundNew, (found) => {
        assert.equal(found.name, _test.name)
      })
    })
    it(`update all`, async () => {
      const _test = {name: `updateNameForAll`}
      const result = await testDat.update({}, _test)
      const arr = await testDat.find(_test)
      assert.equal(result.length, arr.length)
      _.forEach(arr, (found) => {
        assert.equal(found.name, _test.name)
      })
    })
    it(`will return empty array when not found`, async () => {
      const _test = {name: `nameNotExistsUpdate`}
      const result = await testDat.update({name: `nameNotExists`}, _test)
      const arr = await testDat.find(_test)
      assert.isEmpty(result)
      assert.isEmpty(arr)
    })
  })

  describe(`updateOne`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testDat.findOne()
      const where = {name: one.name}
      const _test = {name: `${where.name}Update`}
      const result = await testDat.updateOne(where, _test)
      // update 回傳的資料符合更新後的值
      const found = await testDat.findOne(_test)
      assert.equal(result.id, found.id)
      assert.equal(found.name, found.name)
    })
    it(`will only update first one when search all`, async () => {
      const _test = {name: `updateOneNameForSearchAll`}
      const result = await testDat.updateOne({}, _test)
      const arr = await testDat.find(_test)
      // update 回傳的資料只有第一筆符合更新後的值
      _.forEach(arr, (found, i) => {
        if (i === 0) assert.equal(found.name, result.name)
        else assert.notEqual(found.name, result.name)
      })
    })
    it(`will return null when not found`, async () => {
      const _test = {name: `nameNotExistsUpdateOne`}
      const result = await testDat.updateOne({name: `nameNotExists`}, _test)
      const arr = await testDat.findOne(_test)
      assert.isNull(result)
      assert.isNull(arr)
    })
  })

  describe(`updateById`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const one = await testDat.findOne()
      const _test = {name: `${one.name}Update`}
      const result = await testDat.updateById(one.id, _test)
      // update 回傳的資料符合更新後的值
      const found = await testDat.findOne(_test)
      assert.equal(result.id, found.id)
      assert.equal(found.name, found.name)
    })
    it(`will return null when not found`, async () => {
      const _test = {name: `nameNotExistsUpdateOne`}
      const result = await testDat.updateById(1111, _test)
      const found = await testDat.findOne(_test)
      assert.isNull(result)
      assert.isNull(found)
    })
  })

  describe(`remove`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      await testDat.create({name: `testRemove`})
      await testDat.create({name: `testRemove`})

      const where = {name: `testRemove`}
      const countBefRemove = await testDat.count(where)
      assert.equal(countBefRemove, 2)
      await testDat.remove(where)
      const countAftRemove = await testDat.count(where)
      assert.equal(countAftRemove, 0)
    })
    it(`remove all`, async () => {
      await testDat.remove()
      const arr = await testDat.find()
      assert.isEmpty(arr)
    })
  })

  describe(`removeOne`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      await testDat.create({name: `testRemoveOne`})
      await testDat.create({name: `testRemoveOne`})

      const where = {name: `testRemoveOne`}
      const countBefRemove = await testDat.count(where)
      assert.equal(countBefRemove, 2)
      await testDat.removeOne(where)
      const countAftRemove = await testDat.count(where)
      assert.equal(countAftRemove, countBefRemove - 1)
    })
    it(`will only remove first one when search all`, async () => {
      const where = {}
      const firstOne = await testDat.findOne(where)
      const countBefRemove = await testDat.count(where)
      await testDat.removeOne(where)
      const countAftRemove = await testDat.count(where)
      assert.equal(countAftRemove, countBefRemove - 1)
      // 會移除第一筆資料
      const foundFirstOneAftRemove = await testDat.findOne(firstOne)
      assert.isNull(foundFirstOneAftRemove)
    })
  })

  describe(`removeById`, () => {
    beforeEach(async () => {
      await createRow()
    })

    it(async () => {
      const countBefRemove = await testDat.count()
      const one = await testDat.findOne()
      const id = one.id
      await testDat.removeById(id)
      const countAftRemove = await testDat.count()
      const found = await testDat.findById(id)
      assert.isNull(found)
      assert.equal(countAftRemove, countBefRemove - 1)
    })
    it(`no one will remove when not found`, async () => {
      const countBefRemove = await testDat.count()
      await testDat.removeById(1111)
      const countAftRemove = await testDat.count()
      assert.equal(countAftRemove, countBefRemove)
    })
  })

  describe(`count`, () => {
    it(async () => {
      await testDat.create({name: `testCount`})
      await testDat.create({name: `testCount`})
      const count = await testDat.count({name: `testCount`})
      assert.equal(count, 2)
    })
  })

  describe(`expired`, () => {
    it(async () => {
      const name = `testExpired`
      await testDat.create({name})
      await testDat.create({name})
      await testDat.expired({name}, 1)
      const count = await testDat.count({name})
      assert.equal(count, 2)
      await ck.waiting(1001)
      const count2 = await testDat.count({name})
      assert.equal(count2, 0)
    })
  })

  describe(`expiredOne`, () => {
    it(async () => {
      const name = `testExpiredOne`
      await testDat.create({name})
      await testDat.create({name})
      await testDat.expiredOne({name}, 1)
      const count = await testDat.count({name})
      assert.equal(count, 2)
      await ck.waiting(1001)
      const count2 = await testDat.count({name})
      assert.equal(count2, 1)
    })
  })

  describe(`expiredById`, () => {
    it(async () => {
      const name = `testExpiredById`
      const test = await testDat.create({name})
      await testDat.expiredById(test, 1)
      const count = await testDat.count({name})
      assert.equal(count, 1)
      await ck.waiting(1001)
      const count2 = await testDat.count({name})
      assert.equal(count2, 1)
    })
  })
})
