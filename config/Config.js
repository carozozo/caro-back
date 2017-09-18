class Config {
  get port () {
    return 3000
  }

  get userRoles () {
    return [
      `customer`,
      `stuff`,
      `manager`,
      `admin`
    ]
  }

  get cron () {
    return {
      timezone: `Asia/Taipei`
    }
  }

  getMongoDb (key) {
    const host = `localhost`
    const env = process.env.TEST_MODE ? `test` : process.env.NODE_ENV
    const mainName = `caro-back`
    const analysisDbName = `${mainName}-analysis-${env}`
    const map = {
      analysis: {
        host,
        port: 27017,
        database: analysisDbName,
      }
    }
    return map[key]
  }

  getMysql (key = `main`) {
    const env = process.env.TEST_MODE ? `test` : process.env.NODE_ENV
    const map = {
      main: {
        host: `127.0.0.1`,
        port: 3306,
        database: `caro-back-${env}`,
        username: `root`,
        pwd: `root`,
      }
    }
    return map[key]
  }

  getRedis (key) {
    const map = {
      session: {
        host: `127.0.0.1`,
        port: 6379,
        database: 0,
      }
    }
    return map[key]
  }
}

module.exports = Config
