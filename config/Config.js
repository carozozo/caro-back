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

  get mainDb () {
    const env = process.env.TEST_MODE ? `test` : process.env.NODE_ENV
    return {
      host: `127.0.0.1`,
      port: 3306,
      database: `caro-back-${env}`,
      username: `root`,
      pwd: `root`,
    }
  }

  get analysisDb () {
    const env = process.env.TEST_MODE ? `test` : process.env.NODE_ENV
    const mainName = `caro-back`
    const analysisDbName = `${mainName}-analysis-${env}`
    const host = `localhost`
    return {
      host,
      port: 27017,
      database: analysisDbName,
    }
  }

  get cacheDb () {
    return {
      host: `127.0.0.1`,
      port: 6379,
      database: 0,
    }
  }
}

module.exports = Config
