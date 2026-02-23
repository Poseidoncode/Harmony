# Harmony Prompt Assistant

A VS Code Prompt Assistant Extension based on Vue 3.

[繁體中文版](./README.zh-TW.md)

---

## Usage Guide (English)

### 1. Open Harmony
Click the **Harmony icon** in the VS Code Activity Bar to open the sidebar.

### 2. Template Management
- **Edit Templates**: Click the **"Edit Templates"** button. This opens the `templates.json` file. Any changes saved here will automatically sync to the sidebar.
- **Import/Replace**: Use the **"Import (Replace)"** button to load a new set of templates from a JSON file.
- **Import/Append**: Use the **"Import (Append)"** button to add templates from a JSON file to your existing list.
- **Delete**: Click the trash icon next to a template to remove it.

### 3. Prompt Actions
- **Insert**: Click on a template name to insert its content directly into your active editor or terminal.
- **Chat (Run)**: Send the prompt directly to **GitHub Copilot Chat** and execute it immediately.
- **Chat (Draft)**: Fill the prompt into the **Copilot Chat** input box as a draft without executing.

---

## Features
- **Auto Sync**: Opening and editing the template file through the extension UI will automatically refresh the Sidebar without a restart.
- **Persistent Storage**: Your templates are stored in VS Code's Global Storage, ensuring they persist even after extension updates.
- **Quick Insertion**: Provides various templates with support for direct insertion into the editor or sending to GitHub Copilot Chat.

---

## Contributing
If you are a developer and want to contribute to this project, please check our [Contributing Guide](./CONTRIBUTING.md) for technical instructions.