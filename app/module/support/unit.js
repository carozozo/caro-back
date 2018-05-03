/* 放置一些通用但無分類的函式 */
class Unit {
  get workerIndex () {
    return parseInt(process.env.WORKER_INDEX || 0, 10)
  }

  get isFirstProcess () {
    return this.workerIndex === 0
  }

  get canDropDb () {
    const env = process.env.NODE_ENV
    return this.isFirstProcess && (env === `dev` || env === `beta`)
  }

  // 讓程序可以暫停 ms 後才繼續執行
  async waiting (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = new Unit()
