class DevConfig {
  constructor () {
    require(`dotenv`).config()
  }

  get userRoles () {
    return [
      `customer`,
      `staff`,
      `manager`,
      `admin`
    ]
  }

  get reqSetting () {
    return {
      // 指定哪些 request path 不要寫入傳送的參數
      pathArrForSkipLogArgs: [
        `user/login`,
      ]
    }
  }

  get resSetting () {
    return {
      // 指定哪些 request path 不要寫入回傳的結果
      pathArrForSkipLogResponse: [
      ]
    }
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
      username: process.env.LOG_DB_USERNAME,
      pwd: process.env.LOG_DB_PWD,
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
      pwd: process.env.CACHE_DB_PWD,
    }
  }
}

module.exports = DevConfig
