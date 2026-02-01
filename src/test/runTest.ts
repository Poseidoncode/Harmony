import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// 擴充功能根目錄
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// 測試腳本路徑
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// 下載 VS Code 並啟動測試
		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
