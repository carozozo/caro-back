global.assert = require(`chai`).assert

ck.TEST_PATH = `${ck.PROJECT_PATH}/test`
ck.COMMON_USE = [`authHeader`]

// 用來等待時間
ck.waiting = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
ck.outputResultDoc = (docObj, sucArr, errArr) => {
  if (!sucArr) throw Error(`請輸入 sucArr`)
  if (!errArr) throw Error(`請輸入 errArr`)
  docObj.success = (() => {
    const result = []
    _.reduce(sucArr, (result, suc, i) => {
      result.push({name: `success${i + 1}`, data: suc})
      return result
    }, result)
    return result
  })()
  docObj.error = (() => {
    const result = []
    _.reduce(errArr, (result, err, i) => {
      result.push({name: `error${i + 1}`, data: err})
      return result
    }, result)
    return result
  })()
  ck.apiDoc.outputApi(docObj)
}
