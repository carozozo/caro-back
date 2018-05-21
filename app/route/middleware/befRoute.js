const moment = require(`moment`)
const bodyParser = require(`body-parser`)
const userAgent = require(`express-useragent`)

const doResponse = (req, res, status, ret) => {
  const originalUrl = req.originalUrl
  const requestTime = req.requestTime
  const method = req.method
  const username = _.get(req, `reqUser.$data.username`)
  const userRole = _.get(req, `reqUser.$data.role`)

  const responseData = ck.res.convertResponseData(ret)

  const contractedResponse = ck.res.contractResponse(originalUrl, status, responseData)
  ck.req.writeRequestLog(req, {
    responseTime: new Date(),
    responseStatus: status,
    responseData: contractedResponse,
  })

  let msg = `[${method}] ${originalUrl}, requestTime= ${moment(requestTime).utc().format()}`
  if (username) msg += `, username= ${username}, userRole= ${userRole}`
  const loggerMethod = status === `suc` ? `log` : `err`
  ck.logger[loggerMethod](msg)

  res.json({
    [status]: responseData
  })
}

ck.apiServer.befRoute(bodyParser.urlencoded({extended: false}))
  .befRoute(bodyParser.json())
  .befRoute(userAgent.express())
  .befRoute(ck.auth.init())
  .befRoute((req, res, next) => {
    const originalUrl = req.originalUrl

    if (originalUrl.startsWith(`/apidoc`)) return next()

    // 設置開始 request 時間
    req.requestTime = new Date()

    // 取得所有 req 變數
    req.args = _.assign(req.params, req.body, req.query)

    // 設置 res 客制化 functions
    res.suc = (ret) => {
      doResponse(req, res, `suc`, ret)
    }
    res.err = (ret) => {
      doResponse(req, res, `err`, ret)
    }
    res.war = (ret) => {
      doResponse(req, res, `war`, ret)
    }
    next()
  })
