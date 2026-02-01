# 發佈 VS Code 外掛到 Marketplace 完整指南

這是一份關於如何將 **Harmony Prompt Assistant** 發佈到 Visual Studio Marketplace 的逐步指南。

## 1. 前置準備

### 1.1 安裝發佈工具 (vsce)
`vsce` (Visual Studio Code Extensions) 是官方提供的命令列工具。請在終端機執行：

```bash
npm install -g @vscode/vsce
```

### 1.2 準備 Microsoft 帳戶與 Azure DevOps
VS Code 的發佈驗證依賴於 Azure DevOps。
1. 前往 [Azure DevOps](https://dev.azure.com/) 並使用 Microsoft 帳戶登入。
2. 建立一個新的組織 (Organization)，名稱可以隨意取 (例如 `harmony-dev-org`)。

### 1.3 取得個人存取權杖 (Personal Access Token, PAT)
這是最重要的步驟，您需要產生一個 Token 讓 `vsce` 工具能通過驗證。

1. 在 Azure DevOps 頁面右上角，點擊 **使用者設定 (User settings)** 圖示 -> **Personal access tokens**。
2. 點擊 **+ New Token**。
3. 填寫資訊：
   - **Name**: `VS Code Publishing` (或任意名稱)
   - **Organization**: 選擇您剛建立的組織。
   - **Expiration**: 建議選 `1 year` (避免太快過期)。
   - **Scopes (關鍵)**:
     - 選擇 **Custom defined**。
     - 在下方找到 **Marketplace** 分類。
     - 勾選 **Manage** (必須勾選這個才能發佈)。
4. 點擊 **Create**。
5. **立刻複製那個 Token** (關閉視窗後就看不到了！)。

## 2. 建立發行者 (Publisher)

1. 前往 [Visual Studio Marketplace 管理頁面](https://marketplace.visualstudio.com/manage)。
2. 使用同一個 Microsoft 帳戶登入。
3. 點擊 **Create publisher**。
4. 填寫：
   - **Name**: 顯示給使用者看的名稱 (例如 `Harmony Team`)。
   - **ID**: 網址與 ID 用的名稱 (例如 `harmony-team`)。**請記住這個 ID**。

## 3. 修改專案設定 (package.json)

在您的專案中打開 `package.json`，確保以下欄位正確：

```json
{
  "name": "harmony-prompt-assistant",
  "displayName": "Harmony Prompt Assistant",
  "publisher": "YOUR_PUBLISHER_ID",  <-- 填入您在第 2 步建立的 ID
  "version": "0.0.1",
  "icon": "media/icon.png",          <-- 建議準備一張 128x128 的 icon.png
  ...
}
```

> **注意**：如果不設定 `icon`，發佈時會有警告。建議將目前的 SVG 轉存或截圖為 PNG 放在 media 資料夾。

## 4. 登入並發佈

### 4.1 登入
在終端機執行 (將 `YOUR_PUBLISHER_ID` 換成您的 ID)：

```bash
vsce login YOUR_PUBLISHER_ID
```
系統會提示您輸入 **Personal Access Token**，請貼上第 1.3 步複製的那串亂碼。

### 4.2 發佈
登入成功後，在專案根目錄執行：

```bash
vsce publish
```

或是指定版本號發佈：
- `vsce publish patch` (0.0.1 -> 0.0.2)
- `vsce publish minor` (0.0.1 -> 0.1.0)
- `vsce publish major` (0.0.1 -> 1.0.0)

## 5. 等待審核
發佈成功後，通常需要幾分鐘到幾小時的時間進行安全掃描與驗證。驗證通過後，全世界的使用者就能在 VS Code 中搜尋到您的 **Harmony Prompt Assistant** 了！

---

## 常見問題

**Q: 為什麼發佈失敗說 "Repository field missing"?**
A: 因為 `package.json` 裡沒有設定 `repository`。您可以加上：
```json
"repository": {
  "type": "git",
  "url": "https://github.com/您的帳號/Harmony.git"
}
```
或者在發佈時使用 `vsce publish --no-yarn` (互動模式下按 y 忽略警告)。

**Q: 為什麼上傳後圖示還是預設的？**
A: Marketplace 不支援 SVG 作為主要圖示。請務必準備一個 `icon.png` (至少 128x128) 並在 `package.json` 中指定。
