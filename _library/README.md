# LIBRARY

## 目的
node.js 透過 npm 就提供了各式各樣方便開發的模組及函式庫   
但因為其原生性的關係, 有時在專案開發上就不是非常的便利
   
例如 mongoose 雖然提供了強大的 mongoDB 操作   
但是在 pre and post hook 的執行上卻不是完全支援   
而且 mongoose 的 schema 雖然可以定義 validator 對資料做基本的檢查   
但是卻只在 create 的時候才有效, update 則否

再加上許多 libraries 為了通用/相容性的考量   
函式也變的愈來愈多, 反而造成了維護的不便

舉個例子來說   
mongoose 提供了 model.save 和原生 mongoDB 的 create/update 去儲存資料   
但是 save 卻不會經過 validator 的檢查, 以及它的 hook 參數也不同   
這在開發上就很容易形成漏洞, 進而產生意想不到的 dirty data

所以 library 這個資料夾   
主要就是用來強化 or 簡化開發專案時所需的模組及函式庫   
用以減少開發時可能發生的錯誤, 甚至是增加開發效率

## 特別介紹 MongoModel/RedisModel/SequelizeModel
### 整合了一些基本的 DB 的 CRUD 操作   

把 mongoose/redis/sequelize 不同的呼叫方式統合成共同的使用方法   
例如 原生的 sequelize model 的 .find 用法是   
model.find({where:{id: 1}, 參數1: xxx})

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

### 提供相同的 hook functions

- model.create/createMany 時觸發
```
model.pre('create', (createData, opt = {})=> {
  // 無論是 create/createMany, createData 都是一筆
  // 一些前置處理
})
model.post('create', (result, createData, opt = {})=> {
  // 無論是 create/createMany, result 都是一筆
  // 一些後續處理
})
```
- model.find/findOne/findById 時觸發
```
model.pre('find', (where, opt = {})=> {
  // 一些前置處理
})
model.post('find', (result, where, opt = {})=> {
  // 無論是 find/findOne/findById, result 都是一筆
  // 一些後續處理
})
```
- model.update/updateOne/updateById 時觸發
```
model.pre('update', (where, updateData, opt = {})=> {
  // 一些前置處理
})
model.post('update', (result, where, opt = {})=> {
  // 無論是 update/updateOne/updateById, result 都是一筆
  // 一些後續處理
})
```
- model.remove/removeOne/removeById 時觸發
```
model.pre('remove', (where, opt = {})=> {
  // 一些前置處理
})
model.post('remove', (result, where, opt = {})=> {
  // 無論是 remove/removeOne/removeById, result 都是一筆
  // 一些後續處理
})
```
- model.count 時觸發
```
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