/* 提供註冊 migration 服務 */
class Migration extends ck.Stacker {
  regStack (description, fn) {
    if (!description) throw Error(`請輸入敘述`)
    this._fns.push({description, fn})
  }

  async runStacks () {
    const _fns = this._fns
    for (const key in _fns) {
      const obj = _fns[key]
      const description = obj.description
      const fn = obj.fn
      try {
        ck.logger.log(`\n[${Number(key) + 1}] - ${description}\nresult=`, await fn())
      } catch (e) {
        ck.logger.err(e)
      }
    }
    this._triggerByOn(`runStacks`)
  }
}

module.exports = new Migration()
