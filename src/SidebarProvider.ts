import * as vscode from 'vscode';
import { TextDecoder } from 'util';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  private get _extensionUri(): vscode.Uri {
    return this._context.extensionUri;
  }

  private async _getTemplatesUri(): Promise<vscode.Uri> {
    const storageUri = this._context.globalStorageUri;
    const templatesUri = vscode.Uri.joinPath(storageUri, 'templates.json');
    
    // Ensure directory exists
    try {
      await vscode.workspace.fs.createDirectory(storageUri);
    } catch (e) {
      // Ignore if exists
    }

    // Check if templates.json exists in storage
    try {
      await vscode.workspace.fs.stat(templatesUri);
    } catch (e) {
      // If not, copy from extension resources
      const defaultTemplatesUri = vscode.Uri.joinPath(this._extensionUri, 'resources', 'templates.json');
      try {
        const defaultData = await vscode.workspace.fs.readFile(defaultTemplatesUri);
        await vscode.workspace.fs.writeFile(templatesUri, defaultData);
      } catch (err) {
        console.error('Failed to copy default templates:', err);
      }
    }

    return templatesUri;
  }

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri,
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Auto-reload templates when templates.json is saved
    const templatesUri = await this._getTemplatesUri();
    const fileWatcher = vscode.workspace.onDidSaveTextDocument(async (doc) => {
      if (doc.uri.fsPath === templatesUri.fsPath) {
        const templates = await this._getTemplates();
        webviewView.webview.postMessage({
          type: 'update-templates',
          value: templates
        });
      }
    });

    webviewView.onDidDispose(() => {
      fileWatcher.dispose();
    });

    webviewView.webview.onDidReceiveMessage(async (data) => {
      const currentTemplatesUri = await this._getTemplatesUri();
      switch (data.type) {
        case 'onInfo': {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case 'onError': {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case 'insertText': {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, data.value);
                });
                break;
            }

            const terminal = vscode.window.activeTerminal;
            if (terminal) {
                terminal.sendText(data.value, false); // false means don't hit enter
                break;
            }

            // If neither editor nor terminal is active, fallback to clipboard and notify user
            await vscode.env.clipboard.writeText(data.value);
            vscode.window.showWarningMessage('No active editor or terminal found. The prompt has been copied to your clipboard!');
            break;
        }
        case 'get-templates': {
            const templates = await this._getTemplates();
            webviewView.webview.postMessage({
                type: 'update-templates',
                value: templates
            });
            break;
        }
        case 'sendToChat': {
            // "Chat (Run)" - Auto submit behavior
            vscode.commands.executeCommand('workbench.action.chat.open', {
                query: data.value
            });
            break;
        }
        case 'sendToChatDraft': {
            // "Chat (Draft)" - Attempt to just fill the input
            // Using isPartialQuery: true is a known way to signal "incomplete input" to some internal handlers
            vscode.commands.executeCommand('workbench.action.chat.open', {
                query: data.value,
                isPartialQuery: true
            });
            break;
        }
        case 'open-templates-file': {
            vscode.window.showTextDocument(currentTemplatesUri);
            break;
        }
        case 'import-replace': {
            const options: vscode.OpenDialogOptions = {
                canSelectMany: false,
                openLabel: 'Replace Templates',
                filters: {
                    'JSON files': ['json']
                }
            };

            const fileUri = await vscode.window.showOpenDialog(options);
            if (fileUri && fileUri[0]) {
                try {
                    const newContent = await vscode.workspace.fs.readFile(fileUri[0]);
                    const jsonStr = new TextDecoder('utf-8').decode(newContent);
                    const newTemplates = JSON.parse(jsonStr);

                    if (!Array.isArray(newTemplates)) {
                        throw new Error('Imported data must be an array of templates.');
                    }

                    await vscode.workspace.fs.writeFile(currentTemplatesUri, Buffer.from(JSON.stringify(newTemplates, null, 2), 'utf8'));
                    
                    webviewView.webview.postMessage({
                        type: 'update-templates',
                        value: newTemplates,
                        isFullReplace: true
                    });
                    vscode.window.showInformationMessage('Templates replaced successfully!');
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to replace templates: ${error}`);
                }
            }
            break;
        }
        case 'import-append': {
            const options: vscode.OpenDialogOptions = {
                canSelectMany: false,
                openLabel: 'Import & Prepend Templates',
                filters: {
                    'JSON files': ['json']
                }
            };

            const fileUri = await vscode.window.showOpenDialog(options);
            if (fileUri && fileUri[0]) {
                try {
                    const newContent = await vscode.workspace.fs.readFile(fileUri[0]);
                    const jsonStr = new TextDecoder('utf-8').decode(newContent);
                    const newTemplates = JSON.parse(jsonStr);

                    if (!Array.isArray(newTemplates)) {
                        throw new Error('Imported data must be an array of templates.');
                    }

                    const existingTemplates = await this._getTemplates();
                    
                    // Prepend new templates
                    const updatedTemplates = [...newTemplates, ...existingTemplates];

                    await vscode.workspace.fs.writeFile(currentTemplatesUri, Buffer.from(JSON.stringify(updatedTemplates, null, 2), 'utf8'));
                    
                    webviewView.webview.postMessage({
                        type: 'update-templates',
                        value: updatedTemplates
                    });
                    vscode.window.showInformationMessage(`${newTemplates.length} templates imported and prepended!`);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to import templates: ${error}`);
                }
            }
            break;
        }
        case 'delete-template': {
            if (!data.value || !data.value.id) {
                return;
            }
            const { id, name } = data.value;
            try {
                const templates = await this._getTemplates();
                const updatedTemplates = templates.filter((t: any) => t.id !== id);
                
                const fileData = Buffer.from(JSON.stringify(updatedTemplates, null, 2), 'utf8');
                await vscode.workspace.fs.writeFile(currentTemplatesUri, fileData);
                
                // Manually notify webview as fs.writeFile might not trigger onDidSaveTextDocument
                webviewView.webview.postMessage({
                    type: 'update-templates',
                    value: updatedTemplates
                });
                
                vscode.window.showInformationMessage(`Template "${name}" deleted.`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to delete template: ${error}`);
            }
            break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private async _getTemplates(): Promise<any[]> {
      try {
          const templatesUri = await this._getTemplatesUri();
          const fileData = await vscode.workspace.fs.readFile(templatesUri);
          const jsonStr = new TextDecoder('utf-8').decode(fileData);
          return JSON.parse(jsonStr);
      } catch (error) {
          console.error('Error loading templates:', error);
          return [];
      }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'webview-ui', 'assets', 'index.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'webview-ui', 'assets', 'index.css'));

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <!--
          Use a content security policy to only allow loading images from https or from our extension directory,
          and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>Harmony Prompt Assistant</title>
      </head>
      <body>
        <div id="app"></div>
        <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
