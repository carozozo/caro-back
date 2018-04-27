const env = process.env.NODE_ENV
const Config = require(`init/setConfig/${_.upperFirst(env)}Config`)

module.exports = new Config()
