# 拾事 ShiShi

資料只存在手機上的個人事記 App：隨手記錄事情、附照片、給心情 1–5 分，之後選一段時間回顧，並把回顧整理成文字，讓你自己貼給 AI 討論。

- 本機優先：不需要帳號，也沒有伺服器
- App 本身不呼叫任何 AI API

版本規劃見 [docs/ROADMAP.md](docs/ROADMAP.md)。

## 開發

需要 Node.js 24 以上。

```bash
npm install
npx expo start      # 用手機的 Expo Go 掃 QR code 開啟
npm test            # 單元測試
npx tsc --noEmit    # 型別檢查
```

## 專案結構

| 路徑 | 內容 |
| --- | --- |
| `app/` | 頁面（expo-router） |
| `src/db/` | 所有 SQL：遷移與 repository |
| `src/review/` | 回顧統計與文字產生器（純函式） |
| `src/components/` | 共用元件 |
| `src/theme/` | 設計 token |

## 授權

[MIT](LICENSE)
