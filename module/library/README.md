# LIBRARY

## 目的
```
node.js 透過 npm 就提供了各式各樣方便開發的模組及函式庫
但因為其原生性的關係, 有時在專案開發上就不是非常的便利

例如 mongoose 雖然提供了強大的 mongoDB 操作
但是在 pre and post hook 的執行上卻不是完全支援
而且 mongoose 的 schema 雖然可以定義 validator 對資料做基本的檢查
但是卻只在 create 的時候才有效, update 則否

再加上許多第三方套件為了通用/相容性的考量
函式的變化性也變的愈來愈多, 反而造成了維護的不便

舉個例子來說
mongoose 提供了 model.save 和原生 mongoDB 的 create/update 去儲存資料
但是 save 卻不會經過 validator 的檢查, 以及它的 hook 參數也不同
這在開發上就很容易形成漏洞, 進而產生意想不到的 dirty data

所以 library 主要就是用來強化 or 簡化開發專案時所需的模組及函式庫
用以減少開發時可能發生的錯誤, 甚至是增加開發效率
```

## 注意事項
```
每個 lib 都應該是獨立的項目
除了使用第三方的套件之外, 都不應該使用到專案中其它的項目
目的是為了未來如果 lib 項目變龐大的時候, 可以切出來成為一個獨立的模組
```
