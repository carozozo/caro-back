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

## 特別介紹 MongoModel/RedisModel/SequelizeModel
### 整合了一些基本的 DB 的 CRUD 操作
```
把 mongoose/redis/sequelize 不同的呼叫方式統合成共同的使用方法
例如 原生的 sequelize model 的 .find 用法是
model.find({where:{id: 1}, {參數1: xxx})

而繼承 SequelizeModel 的 model 的 .find 用法是
model.find({id: 1}, {參數1: xxx})

這樣子的用法則和 mongoose 相似
而 RedisModel 則提供了原生的 redis 沒有的 CRUD

目前共通的 static method 有
- create/createMany
- find/findOne/findById
- update/updateOne/updateById
- remove/removeOne/removeById
- count
```

### 提供相同的 hook functions

```
- model.create/createMany 時觸發

model.pre('create', (createData, opt = {})=> {
  // createMany 時, 是以 loop 的方式把每筆資料回傳過來
  // 一些前置處理
})
model.post('create', (result, createData, opt = {})=> {
  // createMany 時, 是以 loop 的方式把每筆資料回傳過來
  // 一些後續處理
})
```

```
- model.find/findOne/findById 時觸發

model.pre('find', (where, opt = {})=> {
  // 一些前置處理
})
model.post('find', (result, where, opt = {})=> {
  // find 時, 是以 loop 的方式把每筆資料回傳過來
  // 一些後續處理
})
```

```
- model.update/updateOne/updateById 時觸發

model.pre('update', (where, updateData, opt = {})=> {
  // 一些前置處理
})
model.post('update', (result, where, opt = {})=> {
  // update 時, 是以 loop 的方式把每筆資料回傳過來
  // 一些後續處理
})
```

```
- model.remove/removeOne/removeById 時觸發

model.pre('remove', (where, opt = {})=> {
  // 一些前置處理
})
model.post('remove', (result, where, opt = {})=> {
  // 無論是 remove/removeOne/removeById, result 都是一筆
  // 一些後續處理
})
```

```
- model.count 時觸發

model.pre('count', (where, opt = {})=> {
  // 一些前置處理
})
model.post('count', (result, where, opt = {})=> {
  // 一些後續處理
})
```

### 支援原生 model 的操作

因捨棄了 mongoose/sequelize 的 method / static function
取出來的會是 plain-object 資料
但如果在開發時有特別的需求, 還是可以透過 .model 的管道執行原生的函式

例如 ck.userMod 繼承 ck.SequelizeModel
```
ck.userMod.find({id: 1}) // 會觸發 hook
// 同等於
ck.userMod.$find({id: 1}) // 不會觸發 hook
// 同等於
ck.userMod.model.findAll({where: {id: 1}}) // 原生的 sequalize 操作
```