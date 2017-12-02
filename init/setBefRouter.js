const bodyParser = require(`body-parser`)
const userAgent = require(`express-useragent`)
const transToInfo = (result) => {
  if (_.isArray(result) && result.length) {
    const ret = result.slice(0, 1)
    return _.replaceLast(JSON.stringify(ret, null, 2), `]`, `  ...\n]`)
  }
  return result
}
const toString = (data) => {
  if (_.isError(data)) return data.toString()
  return data
}
const writeRequestLog = async (req, opt) => {
  const requestTime = opt.requestTime
  const responseStatus = opt.responseStatus
  const responseMsg = opt.responseMsg
  const username = _.get(req, `reqUser.$data.username`, `none`)
  const ip = req.headers[`x-forwarded-for`] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ck.requestMod.create({
    username,
    ip,
    baseUrl: req.baseUrl || req.path,
    path: req.path,
    method: req.method,
    userAgent: req.useragent,
    requestTime,
    responseStatus,
    responseMsg
  })
}

ck.api.use(bodyParser.urlencoded({extended: false}))
  .use(bodyParser.json())
  .use(userAgent.express())
  .use(ck.auth.init())
  .use((req, res, next) => {
    const reqPath = req.originalUrl
    if (reqPath.startsWith(ck.API_DOC_ROUTE_PATH)) return next()
    // 取得所有 req 變數
    req.args = _.assign(req.params, req.body, req.query)
    ck.log(`[${req.method}] ${reqPath} request=`, req.args)
    next()
  })
  .use(async (req, res, next) => {
    const method = req.method
    const path = req.originalUrl
    const now = new Date()

    res.suc = (ret) => {
      ck.log(`[${method}] ${path} response=`, transToInfo(ret))
      const msg = toString(ret)
      writeRequestLog(req, {
        requestTime: now,
        responseStatus: `suc`
      })
      res.json({
        suc: msg
      })
    }
    res.err = (ret) => {
      ck.err(`[${method}] ${path} response error=`, transToInfo(ret))
      const msg = toString(ret)
      writeRequestLog(req, {
        requestTime: now,
        responseStatus: `err`,
        responseMsg: msg
      })
      res.json({
        err: msg
      })
    }
    res.war = (ret) => {
      ck.err(`[${method}] ${path} response warning=`, transToInfo(ret))
      const msg = toString(ret)
      writeRequestLog(req, {
        requestTime: now,
        responseStatus: `war`,
        responseMsg: msg
      })
      res.json({
        war: msg
      })
    }
    next()
  })
