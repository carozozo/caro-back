/* eslint-disable */
// express.js 的 middleware 會以參數數量 4 去判斷是否為 error handler, 所以 next 必須要有
ck.apiServer.aftRoute((err, req, res, next) => {
  const isError = _.isError(err)
  if (isError) {
    res.err(err)
    return
  }
  res.war(err)
})
/* eslint-enable */