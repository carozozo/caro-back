# Caro Back

### 資料夾結構
```
├── _library                              # 通用函式庫, 甚至可以包裝成 node-module
│
├── _support                              # 專案專用, 繼承通用函式庫的內容並加以調整 for 專案特定功能
│
├── app                                   # 專案開發內容
│   ├── _controller                       # 提供 route 對應的功能實作
│   ├── _data                             # 資料處理函式庫, 繼承自 ck.SequelizeData/ck.MongoData...等
│   ├── _fakeData                         # 產生假資料的函式庫, 用在開發時建立初始化的資料, 提供開發測試
│   ├── _route                            # 定義 API 路徑, 只負責接收 request 和 response
│   └── _schema                           # 資料庫欄位定義, 以及 db model 建立
│
├── boot                                  # 啟動各項服務, 例如 DB 連線, 啟動 API Server
│
├── config                                # 專案設定檔
│
├── cron                                  # `npm run cron` 啟動 Cron-Job 項目
│
├── docs                                  # `npm run test.doc` 之後產生的 js 檔 for apidoc 載入
│
├── init                                  # 專案啟動的初始化項目
│
├── logs                                  # 由 ck 產生的記錄檔
│
├── migration                             # 一次性執行項目, 主要處理資料庫異動
│
├── node_modules                          # node.js 模組
│
├── public                                # 提供 client 下載的項目, 目前提供 api-document 網頁
│
├── test                                  # `npm run test` 執行測試; `npm run test.doc` 執行測試和產生 api-document
│
├── .eslintignore                         # es-lint 排除設定檔
│
├── .eslintrc.js                          # es-lint 設定檔
│
├── .gitignore                            # git 排除設定檔
│
├── app.js                                # `npm run app` 啟動專案
│
├── ck.js                                 # Caro Back 基本函式
│
├── ecosystem.config.js                   # pm2 啟動項目設定
│
├── LICENCE                               # 版權宣告
│
├── package.json                          # npm 專案設定
│
├── package.lock.json                     # npm 專案鎖定版號設定(自動產生)
│
├── README.md                             # (這個檔案)
│
├── sample.js                             # `npm run sample` 產生的基礎開發檔案
│
└──
```

### Npm Script 說明 (npm run xxx)
1. `app` `app:環境` 啟動 App-Server
2. `cron` `app:環境` 啟動 Cron-Job
3. `lint` 執行 es-lint 檢查 code 品質
4. `log` `log:環境` 觀看 pm2 log
5. `migration` `migration:環境` 一次性執行項目; 可用環境參數 `TARGET=xxx` 指定要執行的目錄或檔案;
不指定 TARGET 時會依 package version 載入對應的資料夾
6. `TARGET=xxx sample` 用模版(.sample)建立一般例行性開發檔案(.js)
6. `TARGET=xxx sample.delete` 移除一般例行性開發檔案
7. `test` 執行 Unit-Test
8. `test.doc` 執行 Unit-Test 並且建立 API DOC 文件