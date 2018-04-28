# 關於 ck.js

## 使用方式
```
const CaroBack = require(`ck`)
global.ck = new CaroBack()
```

## 函式基本介紹

### lazy-require 自動化載入
```
ck.require(path, opt) - 類似 node require, 載入後會自動掛載到 ck 底下;
opt.load {Boolean} 載入時是否掛載到 ck 底下, 預設 false

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
ck.requireDir(path, opt) - ck.require 強化版, 當 path 是資料夾時, 會自動掛載底下所有的 js 檔案
opt.load   {Boolean} 載入時是否掛載到 ck 底下, 預設 false
opt.level  {Integer} 讀取的資料夾層數, 0 = 不設限, 預設 1

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

sampleDir/c/c.js -
module.exports = {
  ...
}

app.js -
ck.requireDir(`sampleDir`, {load: true})
// 不會讀取 sampleDir/c/c.js, 因為他在資料夾下第二層
ck.a.fn1()
ck.a.fn1()
ck.b.fn3()
ck.b.fn4()
```