ck.boot.regStack(async () => {
  const start = async (port) => {
    ck.debug(`port`, port)
    try {
      ck.info(`準備啟動伺服器, port:`, port)
      await ck.api.listen(port)
      ck.info(`伺服器已啟動, port= ${port}`)
    } catch (err) {
      if (err.code === `EADDRINUSE`) {
        ck.info(`port: ${port} 已被使用`)
        await start(++port)
      }
    }
  }
  const port = process.env.PORT || ck.config.port
  await start(port)
})
