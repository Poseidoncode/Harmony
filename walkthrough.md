# Walkthrough - Webview State Persistence

Implemented state persistence for the Harmony Prompt Assistant webview to ensure user input and navigation state are preserved when switching tabs or reloading.

## Changes

### Extension Backend
- **File:** `src/extension.ts`
- **Change:** Added `retainContextWhenHidden: true` to the `registerWebviewViewProvider` options.
- **Impact:** The webview context (DOM, memory) is now preserved when the sidebar is hidden (e.g., when switching to the Explorer tab and back).

### Webview Frontend
- **File:** `webview-ui/src/App.vue`
- **Changes:**
    - Imported `watch` from Vue.
    - Defined `AppState` interface to track `searchQuery`, `selectedTemplateId`, and `formData`.
    - Initialized `searchQuery` and `formData` from `vscode.getState()`.
    - Added a deep `watch` on relevant state variables to automatically call `vscode.setState()` whenever they change.
    - Updated the `update-templates` message handler to restore the `selectedTemplate` from state once templates are loaded.
- **Impact:** User input in the search box and form fields, as well as the currently selected template, are now persisted even if the webview is destroyed and recreated (e.g., reloading VS Code).

## Verification Results
- Executed `npm run package`, which successfully built the webview and compiled the extension.
- The logic handles synchronization between the loaded templates and the persisted selection ID.
