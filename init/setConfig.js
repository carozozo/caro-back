ck.config = (() => {
  /* 設定檔 */
  const configDir = `../config`
  const env = process.env.NODE_ENV
  const Config = require(`${configDir}/${_.upperFirst(env)}Config`)
  return new Config()
})()
