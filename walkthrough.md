# Harmony Prompt Assistant - 持久化儲存更新

## 變更摘要
為了解決用戶在外掛更新後自定義模板（TEMPLATES）遺失的問題，我們將模板的儲存位置從外掛安裝目錄遷移到了 VS Code 的全域儲存空間（Global Storage）。

## 修改內容
1.  **SidebarProvider.ts**:
    *   修改建構函數以接收 `vscode.ExtensionContext`。
    *   新增 `_getTemplatesUri()` 方法，優先返回 `globalStorageUri` 下的 `templates.json` 路徑。
    *   新增遷移邏輯：若 `globalStorageUri` 中不存在模板檔案，則從外掛資源目錄複製一份預設模板。
    *   更新所有訊息處理邏輯（導入、刪除、開啟檔案），全部改為操作持久化路徑。
2.  **extension.ts**:
    *   更新 `SidebarProvider` 的實例化過程，傳入完整的 `context`。
3.  **README.md**:
    *   更新功能特色說明，標註模板現在具有持久化儲存特性。

## 驗證結果
*   **編譯**: 執行 `npm run compile` 順利完成，無型別錯誤。
*   **持久化原理**: `globalStorageUri` 是 VS Code 為每個外掛分配的獨立且持久的儲存空間，即使外掛更新，該路徑下的內容也會被保留。
