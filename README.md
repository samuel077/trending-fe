# Sam's Backend Lab 專案

這是一個用於展示完整登入流程與 JWT 驗證技術的前端專案，使用 React + Vite + Tailwind CSS 實作，支援註冊、登入、多因素驗證（MFA）、token 驗證、錯誤提示，以及 GitHub Trending Repo 卡片互動展示。

## 🚀 技術棧

- React + Vite
- Tailwind CSS
- JWT accessToken 驗證
- MFA 驗證（驗證碼輸入）
- API 傳輸 JSON
- GitHub Trending Repos 展示
- 動態分頁、卡片放大與模糊效果
- 錯誤提示 Toast 動畫

## 🔐 功能說明

1. **註冊 / 登入流程**
   - 輸入 email 與 password 註冊或登入
2. **MFA 驗證**
   - 登入後輸入 6 碼 MFA 驗證碼以獲得 accessToken
3. **accessToken 管理**
   - 使用者登入後的所有 API 請求皆附帶 Bearer token
4. **Trending Repo 展示**
   - 顯示後端提供的 trending GitHub repo 資料（分頁）
   - 點擊可展開 repo 卡片，並模糊其他卡片
   - 換頁時自動重置 focus 狀態

## 📦 快速啟動

```bash
npm install
npm run dev
```

## 📂 專案結構概覽

```
src/
├── App.jsx
├── App.css
└── index.html
```

## 🧪 測試帳號建議

```json
POST /api/register
{ "email": "test@example.com", "password": "12345678" }

POST /api/login
{ "email": "test@example.com", "password": "12345678" }

POST /api/verify-mfa
{ "email": "test@example.com", "mfaCode": "123456" }
```

## 📄 License

MIT License