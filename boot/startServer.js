ck.boot.regStack(async () => {
  const start = async (port) => {
    try {
      ck.logger.log(`準備啟動伺服器, port:`, port)
      await ck.bootApiServer(ck.apiServer, {port})
      // await ck.apiServer.listen(port)
      ck.logger.log(`伺服器已啟動, port: ${port}`)
    } catch (err) {
      if (err.code === `EADDRINUSE`) {
        ck.logger.log(`port: ${port} 已被使用`)
        await start(++port)
      } else {
        throw err
      }
    }
  }
  const port = process.env.PORT || ck.config.port
  await start(port)
})
