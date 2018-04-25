global.assert = require(`chai`).assert

ck.TEST_PATH = `${ck.PROJECT_PATH}/test`
ck.COMMON_USE = [`authHeader`]

// 用來等待時間
ck.waiting = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
