describe(`MongoData`, () => {
  const fields = {
    name: {type: String},
  }
  const schema = ck.mongoSchema.createSchema(fields)
  let model
  let testDat
  const createRow = async () => {
    const data = {name: `test`}
    return testDat.create(data)
  }

  before(async () => {
    model = ck.analysisDb.createModel(`Test`, schema)
    testDat = new ck.MongoData(model)
  })

  beforeEach(async () => {
    await createRow()
  })

  after(async () => {
    await model.remove()
  })

  describe(`create`, () => {
    const triggerName = `create`
    before(() => {
      testDat.pre(triggerName, (data) => {
        assert.isPlainObject(data)
      })
      testDat.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`create`, async () => {
      const data = {name: `test`}
      const result = await testDat.create(data)
      assert.isPlainObject(result)
    })
    it(`createMany`, async () => {
      const data = {name: `test`}
      const result = await testDat.createMany([data])
      assert.isArray(result)
    })
  })

  describe(`find`, () => {
    const triggerName = `find`
    before(() => {
      testDat.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testDat.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`find`, async () => {
      const result = await testDat.find({})
      assert.isArray(result)
    })
    it(`findOne`, async () => {
      const result = await testDat.findOne({})
      assert.isPlainObject(result)
    })
    it(`findById`, async () => {
      const test = await testDat.findOne()
      const result = await testDat.findById(test._id)
      assert.isPlainObject(result)
      assert.equal(result.username, test.username)
    })
  })

  describe(`update`, () => {
    const triggerName = `update`
    before(() => {
      testDat.pre(triggerName, (where, d) => {
        assert.isPlainObject(where)
        assert.isPlainObject(d)
      })
      testDat.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`update`, async () => {
      const result = await testDat.update({}, {})
      assert.isArray(result)
    })
    it(`updateOne`, async () => {
      const result = await testDat.updateOne({}, {})
      assert.isPlainObject(result)
    })
    it(`updateById`, async () => {
      const test = await testDat.findOne()
      const result = await testDat.updateById(test._id, {})
      assert.isPlainObject(result)
    })
  })

  describe(`remove`, () => {
    const triggerName = `remove`
    before(() => {
      testDat.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testDat.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`remove`, async () => {
      const test = await testDat.findOne()
      const result = await testDat.remove({})
      assert.isArray(result)
      assert.equal(result[0].username, test.username)
    })
    it(`removeOne`, async () => {
      const test = await testDat.findOne()
      const result = await testDat.removeOne({_id: test._id})
      assert.isPlainObject(result)
      assert.equal(result.username, test.username)
    })
    it(`removeById`, async () => {
      const test = await testDat.findOne()
      const result = await testDat.removeById(test._id)
      assert.isPlainObject(result)
      assert.equal(result.username, test.username)
    })
  })

  describe(`count`, () => {
    const triggerName = `count`
    before(() => {
      testDat.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testDat.post(triggerName, (result) => {
        assert.isNumber(result)
      })
    })

    it(`count`, async () => {
      const result = await testDat.count({})
      assert.isNumber(result)
    })
  })
})
