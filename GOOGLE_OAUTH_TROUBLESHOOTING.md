# 🔧 Google OAuth 故障排除指南

## ✅ 你已經正確配置的

從截圖看到：
- ✅ URI 9: `https://chirpnest.vercel.app/api/auth/callback/google` (正確！)

---

## 🔍 需要檢查的其他配置

### 1. 檢查 Google OAuth 應用類型

**步驟：**
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. 點擊你的 OAuth 2.0 Client ID
4. **檢查 "應用程式類型" (Application type):**
   - 必須是：**"網頁應用程式" (Web application)**
   - 不能是：桌面應用程式、iOS、Android 等

---

### 2. 檢查 Vercel 環境變量

**必須檢查的環境變量：**

#### A. NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://chirpnest.vercel.app
```
- ❌ 不能有尾隨斜杠：`https://chirpnest.vercel.app/`
- ❌ 不能是 `http://`
- ✅ 必須完全匹配你的域名

#### B. GOOGLE_CLIENT_ID
```
Name: GOOGLE_CLIENT_ID
Value: [從 Google Cloud Console 複製]
```
- 確認值正確（無多餘空格）
- 確認是從正確的 OAuth 客戶端複製的

#### C. GOOGLE_CLIENT_SECRET
```
Name: GOOGLE_CLIENT_SECRET
Value: [從 Google Cloud Console 複製]
```
- 確認值正確（無多餘空格）
- 如果重新生成過，必須更新 Vercel 中的值

---

### 3. 清理 Google OAuth Redirect URIs

**建議只保留必要的 URI：**

**保留：**
- ✅ `http://localhost:3000/api/auth/callback/google` (本地開發用)
- ✅ `https://chirpnest.vercel.app/api/auth/callback/google` (生產環境)

**可以刪除（避免混淆）：**
- ❌ `http://localhost:3000` (不需要)
- ❌ `https://bbb-jet-mu.vercel.app` (舊項目)
- ❌ `https://chirpnest-h9xuddqvb-vinces-projects-a55d63b1.vercel.app/` (Vercel 預覽 URL，可選)
- ❌ `https://chirpnest.vercel.app/login?from=%2Fhome` (錯誤格式)
- ❌ `https://chirpnest.vercel.app` (缺少路徑)
- ❌ `https://chirpnest.vercel.app/` (有尾隨斜杠)
- ❌ `https://chirpnest-git-main-vinces-projects-a55d63b1.vercel.app` (Vercel 預覽 URL，可選)

**清理步驟：**
1. 刪除所有不必要的 URI
2. 只保留：
   - `http://localhost:3000/api/auth/callback/google`
   - `https://chirpnest.vercel.app/api/auth/callback/google`
3. 點擊 "儲存" (Save)
4. 等待 5-10 分鐘讓更改生效

---

### 4. 檢查 Google OAuth 同意畫面

**步驟：**
1. Google Cloud Console → APIs & Services → OAuth consent screen
2. 確認：
   - ✅ 應用程式狀態：已發布 (Published) 或測試中 (Testing)
   - ✅ 測試使用者：如果狀態是 "測試中"，確保你的 Gmail 在測試使用者列表中
   - ✅ 應用程式名稱：已設置
   - ✅ 支援電子郵件：已設置

---

### 5. 驗證環境變量是否正確傳遞

**檢查方法：**
1. 前往 Vercel → Deployments
2. 點擊最新的部署
3. 查看 Functions 標籤
4. 點擊 `/api/auth/[...nextauth]`
5. 查看日誌，確認沒有環境變量錯誤

---

### 6. 重新部署 Vercel

**重要：** 更新環境變量後必須重新部署！

1. Vercel → Deployments
2. 點擊 "⋯" (三個點)
3. 選擇 "Redeploy"
4. 選擇 "Use existing Build Cache" 或 "Rebuild"
5. 等待部署完成

---

## 🚨 常見錯誤和解決方案

### 錯誤 1: "redirect_uri_mismatch"

**可能原因：**
- NEXTAUTH_URL 與實際域名不匹配
- Redirect URI 格式錯誤（有尾隨斜杠、http vs https）

**解決方案：**
1. 確認 Vercel 中的 `NEXTAUTH_URL` = `https://chirpnest.vercel.app`
2. 確認 Google 中的 Redirect URI = `https://chirpnest.vercel.app/api/auth/callback/google`
3. 兩者必須完全匹配（無尾隨斜杠）

### 錯誤 2: "invalid_client"

**可能原因：**
- GOOGLE_CLIENT_ID 或 GOOGLE_CLIENT_SECRET 錯誤
- 環境變量未正確設置

**解決方案：**
1. 重新從 Google Cloud Console 複製 Client ID 和 Secret
2. 確認在 Vercel 中正確設置
3. 重新部署

### 錯誤 3: "access_denied"

**可能原因：**
- OAuth 同意畫面未正確配置
- 應用程式狀態為 "測試中" 但用戶不在測試列表中

**解決方案：**
1. 檢查 OAuth consent screen 設置
2. 如果狀態是 "測試中"，添加你的 Gmail 到測試使用者列表
3. 或將狀態改為 "已發布" (Published)

---

## ✅ 完整檢查清單

在再次嘗試之前，確認：

- [ ] **Google OAuth Redirect URI:**
  - ✅ `https://chirpnest.vercel.app/api/auth/callback/google` 存在
  - ✅ 已刪除所有不必要的 URI
  - ✅ 已點擊 "儲存"

- [ ] **Vercel 環境變量:**
  - ✅ `NEXTAUTH_URL` = `https://chirpnest.vercel.app` (無尾隨斜杠)
  - ✅ `GOOGLE_CLIENT_ID` = 正確的值
  - ✅ `GOOGLE_CLIENT_SECRET` = 正確的值
  - ✅ 所有變量都啟用了 Production、Preview、Development

- [ ] **Google OAuth 應用設置:**
  - ✅ 應用程式類型 = "網頁應用程式"
  - ✅ OAuth consent screen 已配置
  - ✅ 測試使用者列表包含你的 Gmail（如果狀態是測試中）

- [ ] **已重新部署:**
  - ✅ 更新環境變量後已重新部署 Vercel
  - ✅ 等待部署完成

- [ ] **等待時間:**
  - ✅ 已等待至少 5-10 分鐘讓 Google 設置生效
  - ✅ 已清除瀏覽器緩存或使用無痕模式

---

## 🔄 測試步驟

1. **清除瀏覽器緩存** 或使用無痕模式
2. **訪問:** `https://chirpnest.vercel.app`
3. **嘗試註冊:**
   - 輸入 UserID: `test123`
   - 輸入 Registration Key: `chirpnest2024`
   - 點擊 "Register with Google"
4. **觀察:**
   - 應該重定向到 Google 登錄頁面
   - 不應該出現 `redirect_uri_mismatch` 錯誤

---

## 📞 如果仍然不行

請檢查並告訴我：

1. **Vercel 環境變量中的 `NEXTAUTH_URL` 值是什麼？**
2. **Google Cloud Console 中顯示的完整 Redirect URI 列表**
3. **嘗試登錄時瀏覽器控制台的錯誤信息** (F12 → Console)
4. **Vercel Functions 日誌中的錯誤** (Deployments → Functions → /api/auth/[...nextauth])

---

**記住：** Google OAuth 設置更改可能需要 5 分鐘到數小時才能生效。請耐心等待！

