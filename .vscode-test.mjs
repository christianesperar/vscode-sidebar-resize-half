import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	launchArgs: [
		'--user-data-dir=/tmp/sidebar-resize-half-user-data',
		'--extensions-dir=/tmp/sidebar-resize-half-extensions',
	],
});
