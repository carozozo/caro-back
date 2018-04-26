/* 放置一些通用但無分類的函式 */
class Unit {
  // 讓程序可以暫停 ms 後才繼續執行
  async waiting (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = new Unit()
