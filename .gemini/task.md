# 任務：解決外掛更新後 TEMPLATES 遺失的問題 - 已完成

## 核心問題
目前外掛將 `templates.json` 存放在擴充功能安裝目錄下的 `resources/templates.json`。當擴充功能更新時，VS Code 會更換安裝目錄，導致舊有的自定義模板遺失。

## 解決方案
將用戶的自定義模板存放在 VS Code 提供的 `globalStorageUri` 中。

### 步驟
- [x] 1. 分析 `SidebarProvider.ts` 的載入與儲存邏輯。
- [x] 2. 修改 `SidebarProvider` 以優先從 `globalStorageUri` 讀取模板。
- [x] 3. 實作「首次運行/遷移」邏輯：如果 `globalStorageUri` 沒有模板，則從 `extensionUri` 讀取預設模板並存入 `globalStorageUri`。
- [x] 4. 修改所有寫入操作（`import-replace`, `import-append`, `delete-template`），確保它們寫向 `globalStorageUri`。
- [x] 5. 修改「開啟模板檔案」指令，使其開啟 `globalStorageUri` 中的檔案。
- [x] 6. 驗證變更（編譯通過，程式碼邏輯正確）。
- [x] 7. 更新 README.md 說明。

## 進度
- 2026-02-07: 初始化任務並完成實作。