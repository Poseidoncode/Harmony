# Harmony Prompt Assistant

一個基於 Vue 3 的 VS Code 提示詞助手擴充功能。

## 開發指南

### 1. 安裝依賴
```bash
npm install
```

### 2. 本地開發
在 VS Code 中按下 `F5` 即可啟動偵錯模式，這會開啟一個包含此擴充功能的「擴充功能開發主機」視窗。

- **持續編譯 TypeScript**: `npm run watch`
- **編譯 Webview**: `npm run build:webview`

### 3. 執行測試
此指令會自動編譯程式碼、執行語法檢查 (Lint)，並啟動自動化測試：
```bash
npm test
```

## 打包與發佈

### 打包成 .vsix 檔案
使用 `vsce` 工具將擴充功能打包，以便手動安裝或分享：
```bash
npx @vscode/vsce package
```
*這會執行 `npm run package`，自動包含編譯後的 Webview 與擴充功能主體。*

### 手動安裝
打包完成後，可以使用以下指令安裝：
```bash
code --install-extension harmony-prompt-assistant-0.0.1.vsix
```

## 功能特色
- **自動同步**: 編輯並儲存 `resources/templates.json` 後，Sidebar 會自動刷新，無需重啟。
- **快速插入**: 提供多種模板，支援直接插入編輯器或發送到 GitHub Copilot Chat。