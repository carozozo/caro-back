const bodyParser = require(`body-parser`)
const userAgent = require(`express-useragent`)

// 簡化 response 資料 for log
const contractResponse = (response) => {
  const maxLength = 10
  if (!_.isArray(response) || response.length <= maxLength) return response

  const responseDataLength = response.length
  const ret = []

  for (let i = 0; i < maxLength; i++) {
    ret.push(response[i])
  }
  ret.push(`... and ${responseDataLength - maxLength} more`)
  return ret
}
const convertData = (data) => {
  if (_.isError(data)) return data.message + data.stack
  return data
}
const writeRequestLog = async (req, param) => {
  const args = req.args
  const requestTime = req.requestTime
  const username = _.get(req, `reqUser.$data.username`)
  const userRole = _.get(req, `reqUser.$data.role`)
  const ip = req.headers[`x-forwarded-for`] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  const responseTime = param.responseTime
  const responseStatus = param.responseStatus
  const responseData = param.responseData

  const processMilliseconds = new Date(responseTime) - new Date(requestTime)

  await ck.requestMod.create({
    username,
    userRole,
    ip,
    baseUrl: req.baseUrl || req.path,
    path: req.path,
    method: req.method,
    requestTime,
    requestArgs: args,
    responseTime,
    responseData,
    processMilliseconds,
    responseStatus,
    userAgent: req.useragent,
  })
}

ck.api.use(bodyParser.urlencoded({extended: false}))
  .use(bodyParser.json())
  .use(userAgent.express())
  .use(ck.auth.init())
  .use((req, res, next) => {
    const reqPath = req.originalUrl
    if (reqPath.startsWith(`/apidoc`)) return next()
    // 取得所有 req 變數
    req.args = _.assign(req.params, req.body, req.query)
    ck.logger.log(`[${req.method}] ${reqPath} request=`, req.args)
    next()
  })
  .use(async (req, res, next) => {
    const doResponse = (status, ret) => {
      const method = req.method
      const path = req.originalUrl
      const msg = contractResponse(ret)

      ck.logger.log(`[${method}] ${path} response ${status}=`, msg)
      ret = convertData(ret)

      writeRequestLog(req, {
        responseTime: new Date(),
        responseStatus: status,
        responseData: msg
      })

      res.json({
        [status]: ret
      })
    }

    // 設置開始 request 時間
    req.requestTime = new Date()

    res.suc = (ret) => {
      doResponse(`suc`, ret)
    }
    res.err = (ret) => {
      doResponse(`err`, ret)
    }
    res.war = (ret) => {
      doResponse(`war`, ret)
    }
    next()
  })
