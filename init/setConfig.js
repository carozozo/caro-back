ck.config = (() => {
  /* 設定檔 */
  const configDir = `./_setConfig`
  const env = process.env.NODE_ENV
  const Config = require(`${configDir}/${env === `dev` ? `` : _.upperFirst(env)}Config`)
  return new Config()
})()
