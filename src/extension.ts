import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"harmony-sidebar",
			sidebarProvider
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('harmony-prompt-assistant.helloWorld', () => {
			vscode.window.showInformationMessage('Hello from Harmony Prompt Assistant!');
		})
	);
}

export function deactivate() {}
