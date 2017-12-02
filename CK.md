# 關於 ck.js

## 使用方式
```
const CaroBack = require(`ck`)
global.ck = new CaroBack(opt)

opt.isWriteLog {Boolean} 是否要寫入 .log 檔案
opt.logDir {String} .log 所在資料夾路徑, 預設 ./logs
```

## 函式基本介紹

### console.log 強化版 - 會寫入當下時間及檔案位置
```
ck.ifWriteLog(Boolean) - 需置是否要寫入 log
```
```
ck.debug(...) - 不顯示在 console, 只寫入 debug.log
```
```
ck.info(...) - 只顯示在 console, 不寫入 log
```
```
ck.err(...) - console.error 加強版, 顯示在 console 和寫入 error.log
```
```
ck.log(...) - console.log 加強版, 顯示在 console 和寫入 log.log
```
```
ck.trace(...) - console.trace 加強版, 顯示在 console 和寫入 trace.log
```

### lazy-require 自動化載入
```
ck.require(path, opt) - 類似 node require, 載入後會自動掛載到 ck 底下;
opt.skip {Boolean} 載入時是否掛載到 ck 底下, 預設 true

e.g.
demo.js -
module.exports = {
  fn1: ()=> {},
  fn2: ()=> {},
  ...
}

app.js -
ck.require(`demo.js`)
ck.demo.fn1()
ck.demo.fn2()
```
```
ck.autoRequire(path, opt) - ck.require 強化版, 當 path 是資料夾時, 會自動掛載底下所有的 js 檔案
opt.skip {Boolean} 載入時是否掛載到 ck 底下, 預設 true

e.g.
sampleDir/a.js -
module.exports = {
  fn1: ()=> {},
  fn2: ()=> {},
  ...
}

sampleDir/b.js -
module.exports = {
  fn3: ()=> {},
  fn4: ()=> {},
  ...
}

app.js -
ck.autoRequire(`sampleDir`)
ck.a.fn1()
ck.a.fn1()
ck.b.fn3()
ck.b.fn4()
```