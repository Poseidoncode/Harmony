# Contributing to Harmony Prompt Assistant

This document contains technical instructions for developers who want to build, test, or package the extension.

---

## Technical Guide (English)

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Development
Press `F5` in VS Code to start debugging mode. This will open an "Extension Development Host" window containing this extension.

- **Watch TypeScript**: `npm run watch`
- **Build Webview**: `npm run build:webview`

### 3. Run Tests
```bash
npm test
```

### 4. Packaging
Use the `vsce` tool to package the extension:
```bash
npx @vscode/vsce package
```

---

## 開發者指南 (繁體中文)

### 1. 安裝依賴
```bash
npm install
```

### 2. 本地開發
在 VS Code 中按下 `F5` 即可啟動偵錯模式。

- **持續編譯 TypeScript**: `npm run watch`
- **編譯 Webview**: `npm run build:webview`

### 3. 執行測試
```bash
npm test
```

### 4. 打包專案
使用 `vsce` 工具進行打包：
```bash
npx @vscode/vsce package
```
