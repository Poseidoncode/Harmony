import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
	// 建立 Mocha 執行個體
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }).then(files => {
			// 將測試檔案加入 Mocha
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// 執行測試
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		}).catch(err => {
			return e(err);
		});
	});
}
