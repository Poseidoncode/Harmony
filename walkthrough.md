# Walkthrough - 刪除功能優化與 Replace All 修復

本文件紀錄了移除刪除確認視窗以及修復「Replace All」功能顯示問題的變更細節。

## 變更摘要

### 1. 移除刪除確認 (Task 1)
- **修改檔案**: `src/SidebarProvider.ts`
- **變更內容**: 
    - 移除了 `delete-template` 訊息處理器中的 `vscode.window.showWarningMessage` 邏輯。
    - 現在點擊刪除按鈕後，系統將直接從 `templates.json` 移除該模板，不再跳出詢問視窗。
- **目的**: 提升管理效率，符合使用者「直接刪除就好」的需求。

### 2. 修復 Replace All 功能 (Task 2)
- **問題分析**: 使用者反應「Replace All」後似乎沒有完全取代。經分析，可能是因為 Webview 在更新數據後仍保留了舊的搜尋字串或選取狀態，導致視覺上的誤導。
- **解決方案**:
    - **Extension (`src/SidebarProvider.ts`)**: 在 `import-replace` 完成後，發送訊息時額外帶入 `isFullReplace: true` 旗標。
    - **Webview (`webview-ui/src/App.vue`)**: 收到 `isFullReplace` 旗標時，強制將 `selectedTemplate` 設為 `null` 並清空 `searchQuery`。
- **目的**: 確保在進行完整取代操作後，介面會完全重置，讓使用者看到乾淨的新模板列表。

## 驗證建議
- **刪除測試**: 懸停在任意模板上並點擊 🗑️，模板應立即消失並彈出成功提示，無須確認。
- **取代測試**: 使用「Replace All」(📄) 功能匯入新的 JSON 檔案。匯入後，介面應自動回到列表頂端，搜尋框應清空，且舊有的模板不應出現在列表中。

## 結論
本次變更優化了模板管理的流暢度，並解決了資料取代時的視圖同步問題。