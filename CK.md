# 關於 ck.js

## 使用方式
```
// ck 會掛戴 resource, module 底下的檔案
// 自動宣告 global.ck 和 global._
require(`ck`)
```

## 函式基本介紹

### lazy-require 自動化載入
```
ck.require(path, opt) - 類似 node require
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
ck.requireDir(path, opt) - ck.require 強化版, 當 path 是資料夾時, 會搜尋底下的 js 檔案
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

### DB 連線及 model 載入
```
// e.g. 連接 Redis
const client = new ck.Redis()
const config = {host: `xxx`, port: 6379, database: 0}
const opt = {
  modelDir: `app/model/redis` // 連線後要載入的 model 路徑
}
ck.bootRedis(client, config, opt)
```
```
// e.g. 連接 Mongo
const client = new ck.Mongo()
const config = {host: `xxx`, port: 27017, database: `xxx`, username: `xxx`, pwd: `xxx`}
const opt = {
  schemaDir: `app/model/mongo/schema` // 連線後要載入的 schema 路徑
  modelDir: `app/model/mongo` // 連線後要載入的 model 路徑
  ... // 其它 mongoose 連線參數
}
ck.bootMongo(client, config, opt)
```
```
// e.g. 連接 Maria(MySQL)
const client = new ck.Maria()
const config = {host: `xxx`, port: 3306, database: `xxx`, username: `xxx`, pwd: `xxx`}
const opt = {
  schemaDir: `app/model/maria/schema` // 連線後要載入的 schema 路徑
  modelDir: `app/model/maria` // 連線後要載入的 model 路徑
  ... // 其它 sequelize 連線參數
}
ck.bootMaria(client, config, opt)
```