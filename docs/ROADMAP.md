# 拾事 ShiShi 版本規劃

Nov 17, 2026 · @蔡俊寬

## 產品概要

拾事（ShiShi）是一款資料只存在手機上的個人事記 App：隨手記錄事情、附照片、給心情 1–5 分，之後選一段時間回顧，並把回顧整理成文字，讓使用者自己貼給 AI 討論。分 7 個版本開發，做到 v0.5 就是可以自己天天用的版本。

核心流程：

1. 記錄：寫下事情、選時間、附照片、給心情分數
2. 瀏覽：首頁時間軸依日期分組，上方一週心情色點
3. 回顧：選時間範圍，看統計、心情走勢、照片牆、事件清單
4. 複製給 AI：產生可編輯的文字，複製後貼到任何 AI；照片另外匯出，用編號對應

設計原則：

- 本機優先，不需要帳號或伺服器
- App 本身不呼叫任何 AI API，隱私由使用者自己掌握
- 介面以[拾事 ShiShi 介面設計稿](https://claude.ai/artifact/BwiYTaJGK5m7sTadB39BLt)為準

## 技術選型與資料模型

建議用 Expo（React Native）+ TypeScript：一份程式碼同時做 iOS 與 Android，用 Expo Go 就能直接在手機上測試，Claude Code 對這個生態也很熟。

| 用途 | 套件 |
| --- | --- |
| 框架 | Expo SDK（最新穩定版）、TypeScript strict |
| 頁面路由 | expo-router |
| 本機資料庫 | expo-sqlite |
| 選照片、拍照 | expo-image-picker |
| 照片檔案管理 | expo-file-system（照片複製到 App 自己的資料夾） |
| 複製文字 | expo-clipboard |
| 匯出照片 | expo-sharing |
| 圖表 | react-native-svg 自己畫長條圖，不引入大型圖表套件 |
| 日期處理 | dayjs |
| 測試 | jest + @testing-library/react-native |

資料表（SQLite，用 PRAGMA user\_version 做版本遷移）：

| 資料表 | 欄位 | 說明 |
| --- | --- | --- |
| entries | id TEXT PK、occurred\_at INTEGER、content TEXT、mood INTEGER、created\_at、updated\_at | occurred\_at 是事情發生時間（Unix 毫秒），可與建立時間不同；mood 限 1–5 |
| photos | id TEXT PK、entry\_id FK、file\_path、caption、sort\_order、created\_at | 刪除事記時一併刪檔 |
| tags | id、name UNIQUE | v0.6 才建 |
| entry\_tags | entry\_id、tag\_id | 多對多 |

資料夾結構建議：`app/` 放頁面，`src/db/` 放所有 SQL 與 repository，`src/review/` 放回顧統計與文字產生器（純函式，方便測試），`src/components/` 放共用元件。

## Git 與 GitHub

程式碼放在公開的 GitHub repo，由 Claude Code 用 git 與 gh CLI 操作；APK 全部在 GitHub Actions 上編譯，本機不需要裝 Android Studio。

| 項目 | 做法 |
| --- | --- |
| 分支 | main 永遠可建置；每個版本開 feature/v0.x 分支，完成後開 PR 合併 |
| Commit | 每完成一個小功能就 commit，訊息用 feat: / fix: / chore: 開頭 |
| 版本號 | 驗收通過後打 tag v0.x.0，並同步 app.json 的 version 與 android.versionCode |
| CI | 每次 push 與 PR：npm ci → tsc --noEmit → npm test |
| APK 建置 | 推 v\* tag 時：expo prebuild 產生 android 專案 → Gradle assembleRelease → APK 附加到該版的 GitHub Release |
| 簽章 | release keystore 只放在 GitHub Secrets（base64），CI 執行時還原；repo 裡絕不提交 keystore 或密碼 |

公開 repo 的注意事項：

- .gitignore 排除 node\_modules/、android/、ios/、*.keystore、*.jks、.env
- 測試資料一律用假資料，不提交自己的真實事記或照片
- keystore 還沒準備好前，先產出 debug APK 也能安裝測試

需要你自己做一次的前置作業：

- [ ] 安裝 gh 並執行 gh auth login
- [ ] 用 keytool 產生 release keystore，自己備份好（遺失就無法發布更新版）
- [ ] 在 repo 設定 Secrets：ANDROID\_KEYSTORE\_BASE64、KEYSTORE\_PASSWORD、KEY\_ALIAS、KEY\_PASSWORD

## 版本規劃

每個版本都能在手機上實際操作，驗收通過後打 git tag 再進下一版。v0.5 是第一個完整走完「記錄 → 回顧 → 貼給 AI」的版本。

### v0.1 專案骨架

- 建立 Expo + TypeScript 專案與 expo-router，底部分頁：事記、回顧（先放空白頁）
- git init、.gitignore、README、授權檔，用 gh 建立公開 GitHub repo 並推上去
- GitHub Actions CI：每次 push 與 PR 跑 tsc 與測試
- SQLite 初始化與遷移機制，建 entries 表
- entries repository：新增、查詢（依時間範圍）、更新、刪除
- 設定顏色、字型等設計 token
- 驗收：Expo Go 可開啟；單元測試通過；GitHub 上 CI 綠燈

### v0.2 記錄 MVP

- 新增事記頁：文字、發生時間（預設現在、可改）、心情 1–5 分
- 首頁時間軸：依日期分組（今天、昨天、日期），上方一週心情色點
- 點卡片可編輯、刪除（刪除前確認）
- APK 建置流程：推 v\* tag 後 GitHub Actions 編譯 APK 並發布到 Releases
- 驗收：關掉重開 App 資料還在；補記「昨天」的事會出現在正確日期下；從 Releases 下載 v0.2.0 的 APK 能裝到手機

### v0.3 照片

- 從相簿選多張或直接拍照，複製到 App 資料夾後寫入 photos 表
- 卡片顯示縮圖，點擊全螢幕瀏覽、可左右滑
- 刪除照片或事記時一併刪檔
- 驗收：從相簿刪掉原圖後，App 內照片仍在；刪除事記後沒有殘留檔案

### v0.4 回顧

- 範圍選擇：本週、本月、近 30 天、今年、自訂（月曆選起訖日）
- 統計：事記數、照片數、平均心情、最開心與最低落的一天
- 每日心情長條圖、心情分布、照片牆、依日分組的事件清單
- 統計邏輯寫成純函式並有單元測試
- 驗收：沒有記錄的日子在圖上顯示為空白而非 0 分；範圍內沒有任何事記時有空狀態畫面

### v0.5 複製給 AI（第一個可自用版本）

- 回顧文字產生器：標題、總覽、依日列出事件、結尾討論提示（純函式 + 測試）
- 開關：包含心情分數、標註照片位置、附上討論提示
- 預覽可編輯，一鍵複製
- 匯出照片：依文字裡的編號命名（例如 photo-29.jpg），用系統分享頁送出
- 驗收：複製的文字貼到 Claude、ChatGPT、Gemini 都能正常閱讀；照片編號與文字一致

### v0.6 標籤

- 新增事記時加標籤，輸入時建議既有標籤
- 回顧加上「依標籤整理」：各標籤則數與平均心情
- 時間軸可依標籤篩選；文字產生器可選擇帶入標籤
- 驗收：舊資料遷移後不遺失；重新命名標籤會套用到所有事記

### v1.0 上架準備

- 全文搜尋
- 備份與還原：匯出 JSON + 照片壓縮檔，可匯入到新手機
- 每日提醒通知（可關閉）、深色模式
- App 圖示、啟動畫面、隱私說明頁；正式簽章的 release APK 放在 GitHub Releases
- 驗收：在另一台手機還原備份，事記與照片完整

## 交給 Claude Code

一次只做一個版本：先讓 Claude Code 規劃、你確認後再實作，驗收通過就 commit 並打 tag。

1. 把這份文件匯出成 Markdown，放在專案的 `docs/ROADMAP.md`
2. 在專案根目錄建立 `CLAUDE.md`（內容如下）
3. 開啟 Claude Code，切到 plan mode，貼上第一個 prompt
4. 每版完成後，用手機按驗收標準實測，再請它做下一版

`CLAUDE.md`：

```markdown
# 拾事 ShiShi

版本規劃見 docs/ROADMAP.md，一次只做一個版本。

## 技術
- Expo（最新穩定 SDK）+ TypeScript strict + expo-router
- 資料：expo-sqlite，所有 SQL 集中在 src/db/，頁面不直接寫 SQL
- 照片存在 App 文件資料夾的 photos/ 下
- 回顧統計與文字產生器寫成純函式，放 src/review/，必須有單元測試

## 指令
- 啟動：npx expo start
- 測試：npm test
- 型別檢查：npx tsc --noEmit

## 規則
- 介面文字一律繁體中文
- 完成一個功能後先跑 tsc 與 test，通過才回報
- 不要加入版本規劃以外的功能

## Git
- 每個版本開 feature/v0.x 分支，完成後用 gh pr create 開 PR 合併回 main
- 每完成一個小功能就 commit，訊息用 feat: / fix: / chore: 開頭
- 驗收通過後更新 app.json 的 version，打 tag v0.x.0 並 push，由 GitHub Actions 編譯 APK
- repo 是公開的：絕不提交 keystore、密碼、.env，測試只用假資料

## 設計 token
- 背景 #F6F5F1、卡片 #FFFFFF、文字 #1E2226、次要文字 #5F6670、分隔線 #E4E2DC
- 主色 #2C6E8F
- 心情 1–5：#3E4C6E #7486A8 #9A9A8E #E3A455 #D9682E
- 字型 Noto Sans TC，卡片圓角 16，可點擊區域至少 44
```

第一個 prompt：

```text
請先讀 CLAUDE.md 和 docs/ROADMAP.md。
我們要做 v0.1 專案骨架。請先列出你的實作計畫：要建立的檔案、資料表 schema、要寫的測試。
等我確認後再開始寫程式。完成後告訴我怎麼用 Expo Go 在手機上開起來驗收。
```

開始前還要決定的事：

- [ ] Android package name 確認為 io.github.你的帳號.shishi（App 名稱已定為拾事；第一次發布 APK 後就不能再改，否則無法覆蓋安裝）
- [ ] 開源授權：MIT 還是其他？
- [ ] 技術用 Expo 還是 Flutter？（本文件以 Expo 為前提）
- [ ] 先只做 Android，還是之後也要 iOS？上架 iOS 需要 Apple 開發者帳號
- [ ] 心情分數維持 1–5 分，還是改成 1–10 分？
