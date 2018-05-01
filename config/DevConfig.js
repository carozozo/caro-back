class DevConfig {
  constructor () {
    require(`dotenv`).config()
  }

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
    return {
      host: process.env.MAIN_DB_HOST,
      port: process.env.MAIN_DB_PORT,
      database: `${process.env.MAIN_DB_DATABASE}${process.env.TEST_MODE ? `-test` : ``}`,
      username: process.env.MAIN_DB_USERNAME,
      pwd: process.env.MAIN_DB_PWD,
      excludes: [ // 不想被清空的 table
      ],
    }
  }

  get logDb () {
    return {
      host: process.env.LOG_DB_HOST,
      port: process.env.LOG_DB_PORT,
      database: `${process.env.LOG_DB_DATABASE}${process.env.TEST_MODE ? `-test` : ``}`,
      excludes: [ // 不想被清空的 collection
        `Request`,
        `Logger`,
      ],
    }
  }

  get cacheDb () {
    return {
      host: process.env.CACHE_DB_HOST,
      port: process.env.CACHE_DB_PORT,
      database: process.env.CACHE_DB_DATABASE,
    }
  }
}

module.exports = DevConfig
