# Walkthrough - 新增列表懸停刪除功能

本文件紀錄了「實作列表懸停刪除功能」的變更細節與驗證結果。

## 變更摘要

### Webview UI (Vue 3)
- **新增刪除按鈕**: 在 `template-item` 中加入垃圾桶圖示 (`🗑️`)。
- **懸停顯示邏輯**: 透過 CSS `opacity` 實作，按鈕僅在滑鼠懸停於該項資料時顯現，平時保持隱藏以維持介面清爽。
- **事件冒泡阻斷**: 使用 `@click.stop` 確保點擊刪除按鈕時，不會錯誤地觸發「進入詳細頁」的動作。
- **樣式優化**: 
    - 為列表項加入 `position: relative` 進行絕對定位。
    - 調整內距以防止文字與按鈕重疊。
    - 加入 VS Code 風格的錯誤顏色 (`--vscode-errorForeground`) 與懸停背景色。

### Extension 邏輯 (TypeScript)
- **新增訊息處理器**: 在 `SidebarProvider.ts` 中實作 `delete-template` 分支。
- **安全確認對話框**: 點擊刪除後會彈出 VS Code 原生警告視窗 (`showWarningMessage`)，要求使用者確認是否刪除。
- **檔案系統同步**: 
    - 確認後從 `resources/templates.json` 移除對應資料。
    - 使用 `vscode.workspace.fs.writeFile` 進行原子化寫入。
    - 自動推播更新後的資料回 Webview，確保介面立即同步。

## 驗證結果
- **編譯狀態**:
    - Webview (Vite): `✓ built`
    - Extension (tsc): `Success`
- **功能行為**:
    - [x] Hover 時出現 🗑️。
    - [x] 點擊 🗑️ 出現確認視窗。
    - [x] 取消刪除：資料保留。
    - [x] 確認刪除：資料消失，JSON 檔案同步更新。

## 結論
此功能提升了管理模板的效率，讓使用者無需手動修改 JSON 檔案即可完成快速刪除操作。
