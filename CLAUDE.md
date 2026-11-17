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
