# ChirpNest 🐦

一個類似 Twitter/X 的社交媒體平台，使用 Next.js、NextAuth、MongoDB 和 Pusher 構建。

## 🚀 部署連結

**線上演示：** [https://chirpnest.vercel.app](https://chirpnest.vercel.app)

> ⚠️ **重要提醒：** 
> - 如果您要部署自己的版本，請務必在 **Google OAuth** 和 **GitHub OAuth** 設定中添加您的部署連結
> - 詳細步驟見下方「部署到 Vercel」→「步驟 3：更新 OAuth 重新導向 URI」
> - 這是**必須執行的步驟**，否則 OAuth 登入會失敗！

---

## 🔑 註冊金鑰（REG_KEY）

為了防止任意路人註冊，本應用使用了註冊金鑰保護機制。

**註冊金鑰：** `chirpnest2024`

> 💡 **提示：** 註冊新帳號時，您需要在註冊頁面輸入此金鑰。此金鑰也寫在環境變數 `REG_KEY` 中。

---

## ✨ 功能清單

### 核心功能

- ✅ **用戶認證系統**
  - Google OAuth 登入
  - GitHub OAuth 登入
  - 註冊金鑰保護機制
  - UserID 與 OAuth 提供者永久綁定（一個 UserID 只能綁定一個提供者）

- ✅ **發文系統**
  - 智能字數計算（URL 算 23 字元，Hashtag 和 Mention 不計入）
  - 支援最多 4 張圖片上傳（使用 Cloudinary）
  - **YouTube 影片嵌入** - 貼上 YouTube 連結自動轉換為影片播放器
  - Hashtag 和 Mention 支援（@username, #hashtag）
  - 草稿自動儲存功能

- ✅ **互動功能**
  - **表情符號反應** - 6 種不同的表情反應（👍 Like, ❤️ Love, 😂 Haha, 😮 Wow, 😢 Sad, 😠 Angry）
  - 按讚、回覆、轉發
  - 即時更新（使用 Pusher）
  - 書籤功能
  - 通知系統（即時通知動畫）

- ✅ **用戶系統**
  - 個人資料頁面（可自訂頭像、橫幅、顯示名稱、個人簡介）
  - 追蹤/取消追蹤功能
  - 個人資料編輯功能
  - 發文數統計

- ✅ **其他功能**
  - 深色/淺色主題切換
  - 搜尋功能（搜尋用戶和發文）
  - 首頁動態（全部/追蹤中）
  - 個人資料標籤（發文/按讚）
  - 巢狀回覆系統

---

## 🏗️ 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (Frontend)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Next.js  │  │ React    │  │ Tailwind │  │ TypeScript│   │
│  │ App      │  │ 18.3     │  │ CSS      │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API 路由層 (API Routes)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ NextAuth     │  │ RESTful API  │  │ File Upload  │      │
│  │ (OAuth)      │  │ Routes       │  │ (Cloudinary) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  MongoDB     │  │  Pusher      │  │  Cloudinary  │
│  Atlas       │  │  Channels    │  │  (Images)    │
│  (Database)  │  │  (Real-time) │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 技術架構說明

- **前端框架：** Next.js 14 (App Router) + React 18
- **樣式：** TailwindCSS + 自訂動畫
- **認證：** NextAuth.js (Google/GitHub OAuth)
- **資料庫：** MongoDB Atlas
- **即時通訊：** Pusher Channels
- **圖片上傳：** Cloudinary
- **部署：** Vercel

---

## 📦 安裝與設定

### 前置需求

- Node.js 18+ 
- npm 或 yarn
- MongoDB Atlas 帳號
- Google Cloud Console 帳號（用於 OAuth）
- GitHub 帳號（用於 OAuth）
- Pusher 帳號（用於即時更新）
- Cloudinary 帳號（用於圖片上傳）

---

### 步驟 1：克隆專案

```bash
git clone <your-repo-url>
cd wp1141/hw5
```

### 步驟 2：安裝依賴

```bash
npm install
```

### 步驟 3：設定環境變數

在專案根目錄創建 `.env` 文件：

```env
# NextAuth 設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# 註冊金鑰
REG_KEY=chirpnest2024

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chirpnest?retryWrites=true&w=majority

# Pusher Channels
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap3

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 步驟 4：生成 NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

將輸出結果複製到 `.env` 文件的 `NEXTAUTH_SECRET`。

---

## 🔧 第三方服務設定

### 1. MongoDB Atlas 設定

1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 創建免費集群
3. 創建資料庫用戶（記住用戶名和密碼）
4. **網路存取設定：**
   - 前往 **Security** → **Network Access**
   - 點擊 **Add IP Address**
   - 選擇 **Allow Access from Anywhere** 或輸入 `0.0.0.0/0`
   - 點擊 **Confirm**
5. 獲取連接字串：
   - 點擊 **Connect** → **Connect your application**
   - 複製連接字串
   - 替換 `<password>` 為您的資料庫密碼
   - 將連接字串放入 `.env` 的 `MONGODB_URI`

### 2. Google OAuth 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 **Google+ API**
4. 前往 **APIs & Services** → **Credentials**
5. 點擊 **Create Credentials** → **OAuth client ID**
6. 選擇 **Web application**
7. **已授權的重新導向 URI：**
   - 本地開發：`http://localhost:3000/api/auth/callback/google`
   - **生產環境：** `https://YOUR_DEPLOYED_URL.vercel.app/api/auth/callback/google`
   - ⚠️ **重要：** 部署後必須添加您的 Vercel URL！
8. 複製 **Client ID** 和 **Client Secret** 到 `.env`

### 3. GitHub OAuth 設定

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 點擊 **New OAuth App**
3. **應用程式名稱：** ChirpNest（或您喜歡的名稱）
4. **Homepage URL：** `http://localhost:3000`（本地）或您的部署 URL
5. **Authorization callback URL：**
   - 本地開發：`http://localhost:3000/api/auth/callback/github`
   - **生產環境：** `https://YOUR_DEPLOYED_URL.vercel.app/api/auth/callback/github`
   - ⚠️ **重要：** 部署後必須添加您的 Vercel URL！
6. 點擊 **Register application**
7. 複製 **Client ID** 和 **Client Secret** 到 `.env`

### 4. Pusher 設定

1. 前往 [Pusher](https://pusher.com/)
2. 創建免費帳號
3. 創建新 Channels 應用
4. 選擇最近的集群（例如：`ap3` 用於亞太地區）
5. 複製以下資訊到 `.env`：
   - App ID → `PUSHER_APP_ID`
   - Key → `PUSHER_KEY`
   - Secret → `PUSHER_SECRET`
   - Cluster → `PUSHER_CLUSTER`

### 5. Cloudinary 設定

1. 前往 [Cloudinary](https://cloudinary.com/)
2. 創建免費帳號
3. 前往 **Dashboard**
4. 複製以下資訊到 `.env`：
   - Cloud name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

---

## 🚀 本地執行

### 開發模式

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 生產模式

```bash
npm run build
npm start
```

---

## 🌐 部署到 Vercel

### 步驟 1：推送到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 步驟 2：在 Vercel 部署

1. 前往 [Vercel](https://vercel.com/)
2. 點擊 **Add New...** → **Project**
3. 從 GitHub 導入您的倉庫
4. **設定專案：**
   - Framework Preset: Next.js
   - Root Directory: `wp1141/hw5`（如果專案在子目錄中）
5. **添加環境變數：**
   - 將所有 `.env` 中的變數添加到 Vercel
   - **重要：** `NEXTAUTH_URL` 必須設為您的 Vercel 域名：
     ```
     NEXTAUTH_URL=https://YOUR_PROJECT_NAME.vercel.app
     ```
6. 點擊 **Deploy**

### 步驟 3：更新 OAuth 重新導向 URI ⚠️ 必須執行！

部署完成後，**必須**更新 OAuth 設定：

#### Google OAuth：
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. 點擊您的 OAuth 2.0 Client ID
4. 在 **已授權的重新導向 URI** 中添加：
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/google
   ```
5. 點擊 **儲存**

#### GitHub OAuth：
1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 點擊您的 OAuth App
3. 在 **Authorization callback URL** 中添加：
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/github
   ```
4. 點擊 **Update application**

> ⚠️ **重要：** 如果不執行此步驟，OAuth 登入會失敗並顯示 `redirect_uri_mismatch` 錯誤！

### 步驟 4：重新部署

更新 OAuth 設定後，在 Vercel 中重新部署：
1. Vercel → **Deployments**
2. 點擊 **⋯** → **Redeploy**

---

## 🔍 詳細故障排除指南

### ⚠️ 問題 1：OAuth 登入失敗 - `redirect_uri_mismatch`（最常見）

**錯誤訊息：**
```
已封鎖存取權：「ChirpNest」的要求無效
發生錯誤 400： redirect_uri_mismatch
```

**原因：** OAuth 重新導向 URI 與實際 URL 不匹配

**完整解決步驟：**

#### 步驟 A：檢查 Google OAuth 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. 點擊您的 OAuth 2.0 Client ID
4. 檢查 **已授權的重新導向 URI** 列表
5. **必須包含：**
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/google
   ```
6. **確認事項：**
   - ✅ 使用 `https://`（不是 `http://`）
   - ✅ 沒有尾隨斜杠（`/`）
   - ✅ 完全匹配您的 Vercel 域名
   - ❌ 刪除所有不必要的 URI（只保留必要的）
7. 點擊 **儲存**
8. **等待 5-10 分鐘**讓設定生效

#### 步驟 B：檢查 GitHub OAuth 設定

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 點擊您的 OAuth App
3. 檢查 **Authorization callback URL**
4. **必須包含：**
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/github
   ```
5. **確認事項：**
   - ✅ 使用 `https://`（不是 `http://`）
   - ✅ 沒有尾隨斜杠
   - ✅ 完全匹配您的 Vercel 域名
6. 點擊 **Update application**
7. **等待 5-10 分鐘**讓設定生效

#### 步驟 C：檢查 Vercel 環境變數

1. Vercel Dashboard → 您的專案 → **Settings** → **Environment Variables**
2. 查找 `NEXTAUTH_URL`
3. **值必須是：**
   ```
   https://YOUR_PROJECT_NAME.vercel.app
   ```
4. **確認事項：**
   - ✅ 沒有尾隨斜杠
   - ✅ 使用 `https://`
   - ✅ 完全匹配您的實際 Vercel 域名
5. 如果值不正確，更新並**重新部署**

#### 步驟 D：重新部署

1. Vercel → **Deployments**
2. 點擊 **⋯** → **Redeploy**
3. 等待部署完成

#### 步驟 E：清除緩存並測試

1. 清除瀏覽器緩存或使用無痕模式
2. 訪問您的網站
3. 嘗試登入

**正確格式範例：**
```
✅ https://chirpnest.vercel.app/api/auth/callback/google
✅ https://chirpnest.vercel.app/api/auth/callback/github
✅ NEXTAUTH_URL=https://chirpnest.vercel.app

❌ http://chirpnest.vercel.app/api/auth/callback/google
❌ https://chirpnest.vercel.app/api/auth/callback/google/
❌ NEXTAUTH_URL=https://chirpnest.vercel.app/
```

### ⚠️ 問題 2：資料庫連接失敗 - 500 錯誤

**錯誤訊息：**
```
Internal server error
Database connection not configured
```

**完整解決步驟：**

#### 步驟 A：檢查 MongoDB Atlas Network Access

1. 前往 [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Security** → **Network Access**
3. 確認有條目顯示 `0.0.0.0/0`（允許所有 IP）
4. 如果沒有，點擊 **Add IP Address**：
   - 選擇 **Allow Access from Anywhere**
   - 或手動輸入：`0.0.0.0/0`
   - 點擊 **Confirm**
5. **等待 1-2 分鐘**讓設定生效

#### 步驟 B：檢查 MongoDB 連接字串

1. MongoDB Atlas → **Database** → **Connect**
2. 選擇 **Connect your application**
3. 複製連接字串
4. 格式應為：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/chirpnest?retryWrites=true&w=majority
   ```
5. **重要：**
   - 將 `<password>` 替換為您的實際密碼
   - 如果密碼包含特殊字符，需要 URL 編碼：
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `=` → `%3D`

#### 步驟 C：檢查 Vercel 環境變數

1. Vercel → **Settings** → **Environment Variables**
2. 確認 `MONGODB_URI` 存在且值正確
3. 確認沒有多餘的空格或引號
4. 更新後**重新部署**

#### 步驟 D：驗證資料庫用戶權限

1. MongoDB Atlas → **Security** → **Database Access**
2. 確認您的用戶有 **Read and write** 權限
3. 如果沒有，編輯用戶並添加權限

### ⚠️ 問題 3：圖片上傳失敗

**錯誤訊息：**
```
Failed to upload image
Cloudinary error
```

**完整解決步驟：**

1. **檢查 Cloudinary 環境變數：**
   - Vercel → **Settings** → **Environment Variables**
   - 確認以下三個變數都存在：
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
   - 確認值正確（從 Cloudinary Dashboard 複製）

2. **檢查 Cloudinary 帳號狀態：**
   - 前往 [Cloudinary Dashboard](https://cloudinary.com/console)
   - 確認帳號處於活動狀態
   - 檢查使用限制（免費帳號有使用限制）

3. **驗證 API 憑證：**
   - Cloudinary Dashboard → **Settings** → **Security**
   - 確認 API Key 和 Secret 正確
   - 如果重新生成過，必須更新 Vercel 中的值

4. **重新部署：**
   - 更新環境變數後，在 Vercel 中重新部署

### ⚠️ 問題 4：即時更新不工作

**症狀：** 按讚、回覆、轉發後，其他用戶看不到即時更新

**完整解決步驟：**

1. **檢查 Pusher 環境變數：**
   - Vercel → **Settings** → **Environment Variables**
   - 確認以下四個變數都存在：
     - `PUSHER_APP_ID`
     - `PUSHER_KEY`
     - `PUSHER_SECRET`
     - `PUSHER_CLUSTER`
   - 確認值正確

2. **檢查 Pusher 集群設定：**
   - 前往 [Pusher Dashboard](https://dashboard.pusher.com/)
   - 確認 `PUSHER_CLUSTER` 與您的應用集群匹配
   - 常見集群：`ap3`（亞太）、`us2`（美國）、`eu`（歐洲）

3. **檢查 Pusher 應用狀態：**
   - Pusher Dashboard → 您的應用
   - 確認應用處於 **Active** 狀態
   - 檢查使用限制

4. **檢查瀏覽器控制台：**
   - 按 F12 → **Console**
   - 查看是否有 Pusher 連接錯誤
   - 確認 `NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 正確設置

### ⚠️ 問題 5：Vercel 構建失敗

**錯誤類型：**

#### A. ESLint 錯誤
```
Error: `'` can be escaped with `&apos;`
```

**解決方案：**
- 已在 `next.config.js` 中禁用構建時的 ESLint
- 如果仍有問題，確認 `next.config.js` 包含：
  ```js
  eslint: {
    ignoreDuringBuilds: true,
  }
  ```

#### B. 環境變數缺失
```
Error: Please add your MONGODB_URI to .env
```

**解決方案：**
1. 確認所有 15 個環境變數都在 Vercel 中設置
2. 確認變數名稱完全匹配（大小寫敏感）
3. 確認值正確（無多餘空格）

#### C. TypeScript 錯誤
```
Type error: ...
```

**解決方案：**
1. 本地運行 `npm run build` 檢查錯誤
2. 修復所有 TypeScript 錯誤
3. 確認所有類型定義正確

#### D. 依賴安裝失敗
```
npm ERR! ...
```

**解決方案：**
1. 確認 `package.json` 中的依賴版本正確
2. 嘗試刪除 `package-lock.json` 並重新安裝
3. 檢查 Node.js 版本（需要 18+）

---

## 📝 使用指南

### 註冊新帳號

1. 訪問登入頁面
2. 點擊 **「註冊」**
3. 輸入 UserID（3-15 個字符，小寫字母、數字、底線）
4. 輸入註冊金鑰：`chirpnest2024`
5. 選擇 OAuth 提供者（Google 或 GitHub）
6. 完成 OAuth 認證
7. 完成！

### 登入

1. 輸入您的 UserID
2. 點擊 **「登入」**
3. 系統會自動識別您使用的 OAuth 提供者
4. 完成 OAuth 認證
5. 完成！

### 發文

1. 點擊側邊欄的 **「Post」** 按鈕
2. 輸入內容（最多 280 字元）
3. 可選：上傳圖片（最多 4 張）
4. 可選：貼上 YouTube 連結（會自動嵌入為影片）
5. 點擊 **「Post」**

### 互動功能

- **表情反應：** 將滑鼠懸停在按讚按鈕上，選擇表情符號
- **回覆：** 點擊回覆按鈕，輸入回覆內容
- **轉發：** 點擊轉發按鈕
- **書籤：** 點擊書籤圖標保存發文

---

## 🗂️ 專案結構

```
wp1141/hw5/
├── app/
│   ├── (auth)/          # 認證相關頁面
│   │   └── login/
│   ├── (main)/          # 主要功能頁面
│   │   ├── home/        # 首頁動態
│   │   ├── profile/     # 個人資料
│   │   ├── post/        # 發文詳情
│   │   ├── bookmarks/   # 書籤
│   │   └── notifications/ # 通知
│   └── api/             # API 路由
│       ├── auth/        # 認證 API
│       ├── posts/       # 發文 API
│       ├── users/       # 用戶 API
│       └── ...
├── components/          # React 組件
├── lib/                 # 工具函數
│   ├── auth.ts         # NextAuth 設定
│   ├── db.ts           # MongoDB 連接
│   ├── pusher.ts       # Pusher 設定
│   └── validators.ts   # 驗證函數
├── types/              # TypeScript 類型定義
├── .env                # 環境變數（不提交到 Git）
├── .gitignore          # Git 忽略文件
├── next.config.js      # Next.js 設定
├── package.json        # 依賴清單
└── README.md           # 本文件
```

---

## 🔒 安全性措施

1. **註冊金鑰保護：** 使用 `REG_KEY` 防止任意註冊
2. **環境變數：** 所有敏感資訊存儲在環境變數中
3. **OAuth 驗證：** 使用 Google/GitHub OAuth 進行安全認證
4. **UserID 綁定：** 每個 UserID 只能綁定一個 OAuth 提供者，防止帳號衝突
5. **輸入驗證：** 所有用戶輸入都經過驗證和清理

---

## 📚 技術棧

- **前端：** Next.js 14, React 18, TypeScript, TailwindCSS
- **認證：** NextAuth.js
- **資料庫：** MongoDB Atlas
- **即時通訊：** Pusher Channels
- **圖片上傳：** Cloudinary
- **部署：** Vercel

---

## 🐛 已知問題與限制

- ESLint 在構建時被禁用（見 `next.config.js`）
- MongoDB 連接使用延遲初始化以避免構建時錯誤
- Pusher 使用延遲初始化以避免環境變數缺失時崩潰

---

## 📞 支援與常見問題

### 快速檢查清單

在尋求幫助之前，請確認：

- [ ] 所有 15 個環境變數都在 Vercel 中設置
- [ ] `NEXTAUTH_URL` = 您的實際 Vercel 域名（無尾隨斜杠）
- [ ] Google OAuth Redirect URI 包含您的 Vercel URL
- [ ] GitHub OAuth Callback URL 包含您的 Vercel URL
- [ ] MongoDB Network Access 允許 `0.0.0.0/0`
- [ ] 所有 OAuth 設定更改後已等待 5-10 分鐘
- [ ] 更新環境變數後已重新部署 Vercel
- [ ] 已清除瀏覽器緩存或使用無痕模式測試

### 如何查看錯誤日誌

#### Vercel 日誌：
1. Vercel Dashboard → **Deployments**
2. 點擊最新的部署
3. 查看 **Logs** 標籤
4. 查看 **Functions** 標籤（API 路由錯誤）

#### 瀏覽器控制台：
1. 按 F12 打開開發者工具
2. 查看 **Console** 標籤
3. 查看 **Network** 標籤（API 請求錯誤）

### 如果仍然無法解決

請提供以下資訊：

1. **錯誤訊息**（完整文字）
2. **Vercel 部署日誌**（截圖或複製文字）
3. **瀏覽器控制台錯誤**（F12 → Console）
4. **環境變數檢查清單**（確認哪些已設置）
5. **OAuth 設定截圖**（Google 和 GitHub 的 Redirect URI 列表）

---

## ⚠️ 重要提醒：部署後必須執行的步驟

### 1. 更新 OAuth 重新導向 URI（必須！）

部署到 Vercel 後，**必須**在以下位置添加您的 Vercel URL：

#### Google OAuth：
```
https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/google
```

#### GitHub OAuth：
```
https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/github
```

**如果不執行此步驟，OAuth 登入會失敗！**

### 2. 更新 Vercel 環境變數

將 `NEXTAUTH_URL` 更新為您的實際 Vercel 域名：
```
NEXTAUTH_URL=https://YOUR_PROJECT_NAME.vercel.app
```

### 3. 重新部署

完成上述步驟後，在 Vercel 中重新部署專案。

---

## 📄 授權

本專案僅供學習使用。

---

## 👤 作者

- **UserID：** vinlee1030
- **GitHub：** [vinlee1030](https://github.com/vinlee1030)

---

**祝使用愉快！** 🎉
