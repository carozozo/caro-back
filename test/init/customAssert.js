/* 客製化 assert */
const assert = global.assert
const _checkApiKey = (response, key) => {
  if (!_.has(response, key)) {
    throw Error(`Response ${JSON.stringify(response)} 應該為 {${key}: xxxx}`)
  }
  return response[key]
}

assert.isPlainObject = (arg) => {
  assert.isTrue(_.isPlainObject(arg))
}

assert.shouldGotErr = async (fn) => {
  let err
  try {
    await fn()
  } catch (e) {
    err = e
  }
  if (!err) throw Error(`should got error but not`)
  ck.logger.err(`got error:`, (err.toString && err.toString()) || err)
}

assert.apiSuc = (response) => {
  return _checkApiKey(response, `suc`)
}

assert.apiErr = (response) => {
  return _checkApiKey(response, `err`)
}

assert.apiWar = (response) => {
  return _checkApiKey(response, `war`)
}
