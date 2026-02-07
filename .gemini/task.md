# Task: 實作列表懸停刪除功能

## 現狀分析
- 列表頁僅能點擊進入詳細頁或透過設定圖示開啟 JSON 檔案管理。
- 缺乏直接在列表中快速管理（刪除）的功能。

## 待辦事項
- [x] 修改 Webview (`App.vue`)：在列表項中加入刪除按鈕。
- [x] 實作 CSS：確保刪除按鈕僅在 Hover 時顯示。
- [x] 修改 Webview 邏輯：實作 `confirmDelete` 函數，發送訊息給 Extension。
- [x] 修改 Extension (`SidebarProvider.ts`)：新增 `delete-template` 訊息處理邏輯。
- [x] 實作檔案寫入邏輯：從 `templates.json` 中移除對應 ID 的模板。
- [x] 驗證功能與編譯。

## 進度紀錄
- 2026-02-07: 完成同步邏輯修復。
- 2026-02-07: 完成懸停刪除功能實作。
- 2026-02-07: 通過編譯驗證。
