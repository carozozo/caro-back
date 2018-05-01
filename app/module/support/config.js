const env = process.env.NODE_ENV
const Config = require(`config/${_.upperFirst(env)}Config`)

module.exports = new Config()
