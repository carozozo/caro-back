const docRouter = ck.apiServer.createRouter(`/`)

docRouter.get(`/apidoc/*`, async (req, res) => {
  const authorization = req.headers.authorization
  const returnDenied = () => {
    res.statusCode = 401
    res.setHeader(`WWW-Authenticate`, `Basic realm="apidoc"`)
    res.end(`Access denied`)
  }

  if (!authorization) return returnDenied()

  const ba = authorization.split(` `)
  const basic = ba[0]
  const base64 = ba[1]
  const au = Buffer.from(base64, `base64`).toString(`ascii`).split(`:`)
  const username = au[0]
  const pwd = au[1]
  if (username !== `admin`) return returnDenied()
  const user = await ck.userMod.findByUsername(username)
  if (!(user && _.eq(`Basic`, basic))) return returnDenied()

  try {
    await ck.userMod.ifSamePwd(user, pwd)
  } catch (e) {
    return returnDenied()
  }

  const reqPath = req.path
  res.sendFile(`${process.env.PWD}/public${reqPath}`)
})

const group = ``
const groupPath = ck.apiServer.getGroupPath(group)
const router = ck.apiServer.createRouter(groupPath)

router.post(`/batchRequest`, async (req, res) => {
  const protocol = req.protocol
  const host = req.headers.host
  const request = new ck.RequestPromise(`${protocol}://${host}`)
  const resultMap = {}
  const body = req.body

  for (const path in body) {
    if (!body.hasOwnProperty(path)) continue
    const params = body[path]
    if (!params.method) throw Error(`缺少參數 method`)

    let eachMethod = params.method.toLowerCase() // get/post/put/delete
    const eachBody = params.body // 個別的 request body
    const headers = req.headers
    const opt = {headers} // 將 client 端的 header 套用到個別的 request
    delete headers[`content-length`] // 個別的 request 長度不一樣

    if (!request[eachMethod]) throw Error(`不支援的 method [${eachMethod}]`)

    if (eachMethod === `get`) {
      resultMap[path] = await request[eachMethod](path.trim(), opt)
    } else {
      resultMap[path] = await request[eachMethod](path.trim(), eachBody, opt)
    }
  }
  res.send(resultMap)
})
