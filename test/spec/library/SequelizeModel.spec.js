describe(`MariaModel`, () => {
  const db = ck.mainDb
  const Sequelize = db.Sequelize
  const fields = {
    name: {type: Sequelize.STRING(25)},
  }
  let model
  let testMod
  const createRow = async () => {
    const data = {name: `test`}
    return testMod.create(data)
  }

  before(async () => {
    model = db.createModel(`Test`, fields)
    testMod = new ck.MariaModel(model)
    await model.sync()
  })

  beforeEach(async () => {
    await createRow()
  })

  after(async () => {
    await model.drop()
  })

  describe(`create`, () => {
    const triggerName = `create`
    before(() => {
      testMod.pre(triggerName, (data) => {
        assert.isPlainObject(data)
      })
      testMod.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`create`, async () => {
      const data = {name: `test`}
      const result = await testMod.create(data)
      assert.isPlainObject(result)
    })

    it(`createMany`, async () => {
      const data = {name: `test`}
      const result = await testMod.createMany([data])
      assert.isArray(result)
    })
  })

  describe(`find`, () => {
    const triggerName = `find`
    before(() => {
      testMod.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testMod.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`find`, async () => {
      const result = await testMod.find({})
      assert.isArray(result)
    })
    it(`findOne`, async () => {
      const result = await testMod.findOne({})
      assert.isPlainObject(result)
    })
    it(`findById`, async () => {
      const test = await testMod.findOne()
      const result = await testMod.findById(test.id)
      assert.isPlainObject(result)
      assert.equal(result.name, test.name)
    })
  })

  describe(`update`, () => {
    const triggerName = `update`
    before(() => {
      testMod.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testMod.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`update`, async () => {
      const result = await testMod.update({}, {})
      assert.isArray(result)
    })
    it(`updateOne`, async () => {
      const result = await testMod.updateOne({}, {})
      assert.isPlainObject(result)
    })
    it(`updateById`, async () => {
      const test = await testMod.findOne()
      const result = await testMod.updateById(test.id, {})
      assert.isPlainObject(result)
    })
  })

  describe(`remove`, () => {
    const triggerName = `remove`
    before(() => {
      testMod.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testMod.post(triggerName, (result) => {
        assert.isPlainObject(result)
      })
    })

    it(`remove`, async () => {
      const test = await testMod.findOne()
      const result = await testMod.remove({id: test.id})
      assert.isArray(result)
      assert.equal(result[0].name, test.name)
    })
    it(`removeOne`, async () => {
      const test = await testMod.findOne()
      const result = await testMod.removeOne({id: test.id})
      assert.isPlainObject(result)
      assert.equal(result.name, test.name)
    })
    it(`removeById`, async () => {
      const test = await testMod.findOne()
      const result = await testMod.removeById(test.id)
      assert.isPlainObject(result)
      assert.equal(result.name, test.name)
    })
  })

  describe(`count`, () => {
    const triggerName = `count`
    before(() => {
      testMod.pre(triggerName, (where) => {
        assert.isPlainObject(where)
      })
      testMod.post(triggerName, (result) => {
        assert.isNumber(result)
      })
    })

    it(`count`, async () => {
      const result = await testMod.count({})
      assert.isNumber(result)
    })
  })
})
