# Task: Implement Webview State Persistence

## Status
- [x] Investigate current webview implementation <!-- id: 0 -->
- [x] Enable `retainContextWhenHidden` in `SidebarProvider.ts` <!-- id: 1 -->
- [x] Implement VS Code webview state persistence in Vue 3 frontend <!-- id: 2 -->
- [x] Verify state persistence when switching tabs <!-- id: 3 -->
- [x] Generate walkthrough.md <!-- id: 4 -->

## Progress
- Initialized task.md
- Added `retainContextWhenHidden: true` to `registerWebviewViewProvider` in `extension.ts`.
- Implemented `vscode.getState()` and `vscode.setState()` in `App.vue`.
- Added deep watch to persist state on changes.
- Added logic to restore selected template from state when templates are loaded.
- Verified build with `npm run package`.

## Research Notes: LLM Memory & RLM
- **Memory Sharing**: Gemini CLI instances share long-term memory via `save_memory` and project-level state via `.gemini/task.md`.
- **Context Management**: To prevent AI performance degradation in long chats, use "External Brain" strategies: offloading details to files and using targeted searches (`grep`).
- **RLM (Recursive Language Model)**: 
    - **Logic**: Programmatic recursion. It turns context into variables in a REPL environment.
    - **Efficiency**: Instead of filling the context window with raw data, it writes code to process data fragments and sub-calls itself.
    - **Use Case**: Massive data analysis (e.g., TSMC analyst reports). It keeps the AI's "main mind" clean while using a "sandbox PC" to handle the heavy lifting.
