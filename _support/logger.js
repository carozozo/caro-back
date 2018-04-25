/* 實作 ck.Logger 物件 */
module.exports = new ck.Logger({
  cb: async (type, path, args) => {
    if (!ck.loggerMod) return

    // 呼叫 ck.logger.log / ck.logger.err 時, 寫入 db
    await ck.loggerMod.create({type, path, args})
  }
})