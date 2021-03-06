# Caro Back

## 資料夾結構
```
├── app                                   # app root
│   ├── model                             # 資料函式庫, 實作每個獨立 DB-Table 所需的邏輯處理, 繼承自 ck.MariaModel/ck.MongoModel...等
│   │   ├── maria                         # maria model
│   │   ├── mongo                         # mongo model
│   │   └── redis                         # redis model
│   │
│   ├── module                            # 專案函式庫
│   │   ├── controller                    # 提供 route 對應的功能實作
│   │   ├── fakeData                      # 產生假資料的函式庫, 用在開發時建立初始化的資料, 提供開發測試
│   │   ├── library                       # 通用函式庫, 由 node-module 包裝或是客製成適合快速開發/管控專案
│   │   ├── service                       # 由 controller 抽出來的單元/共用函式, 分擔其工作量以及可以實作更精確的單元測試
│   │   └── support                       # 專案專用函式庫, 繼承通用函式庫的內容或是特定邏輯函式 for 專案開發
│   │
│   └── route                             # 定義 API 路徑, 負責接收 request 和 response
│
├── boot                                  # 啟動各項服務, 例如 DB 連線, 啟動 API Server
│
├── cron                                  # `npm run cron` 啟動 Cron-Job 項目
│   └── schema                            # Cron-Job 執行內容
│
├── docs                                  # `npm run test.doc` 之後產生的 js 檔 for apidoc 載入
│
├── migration                             # 一次性執行項目, 主要處理資料庫異動
│
├── node_modules                          # node.js 模組
│
├── public                                # 提供 client 下載的項目, 目前提供 api-document 網頁
│
├── resource                              # ck 基本函式庫
│
├── test                                  # Unit-Test 項目
│   ├── init                              # test 啟動時要載入的初始化項目
│   ├── spec                              # 各類要測試的項目實作
│   └── app.js                            # `npm run test` 執行測試執行檔; `npm run test.doc` 執行測試和產生 api-document
│
├── .eslintignore                         # es-lint 排除設定檔
│
├── .eslintrc.js                          # es-lint 設定檔
│
├── .gitignore                            # git 排除設定檔
│
├── app.js                                # `npm run app` 啟動專案執行檔
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
├── sample.js                             # `npm run sample` 產生基礎開發檔案的執行檔; `npm run sample.delete` 移除開發檔案
│
└──
```

## Server 啟動基本流程
- app.js 啟動
- 載入 module - 各種函式庫 and 功能實作
- 載入 init 初始化項目
- 載入 route - API 對外窗口
- 載入 boot 執行 DB 連線/啟動 API server... 等啟動項目

## 包含 app.js 的 Server 主要分類
- root
- cron Cron-Job 排程項目
- migration 一次性執行項目
- test Unit-Test

## Npm Script 說明 (npm run xxx)
- `app` `app:環境` 啟動 App-Server
- `cron` `app:環境` 啟動 Cron-Job
- `lint` 執行 es-lint 檢查 code 品質
- `log` `log:環境` 觀看 pm2 log
- `migration` `migration:環境` 一次性執行項目; 可用環境參數 `TARGET=xxx` 指定要執行的目錄或檔案;
不指定 TARGET 時會依 package version 載入對應的資料夾
- `TARGET=xxx FOLDER=xxx sample` 用模版(.sample)建立基礎開發檔案(.js); 可不指定 FOLDER
- `TARGET=xxx FOLDER=xxx sample.delete` 移除基礎開發檔案; 可不指定 FOLDER
- `test` 執行 Unit-Test
- `test.doc` 執行 Unit-Test 並且建立 API DOC 文件

## 一些五四三
- 執行 `TARGET=xxx npm run sample` 產生出來的範例就是基本的 code style
- route 的 response 做了最大的簡化, 只有 suc/war/err 三種狀態