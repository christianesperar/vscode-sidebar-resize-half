import * as assert from 'assert';
import * as vscode from 'vscode';
import {
	calculateCompactResizeSteps,
	calculateResizeSteps,
	getTargetResizeSteps,
	resizeCommandId,
} from '../extension';

suite('Extension Test Suite', () => {
	test('keeps the sidebar below 45 percent of the window', () => {
		assert.strictEqual(calculateResizeSteps(1440, 170), 7);
		assert.strictEqual(calculateResizeSteps(800, 170), 3);
		assert.strictEqual(calculateResizeSteps(300, 170), 0);
	});

	test('toggles between wide and twice the minimum width', () => {
		const compactSteps = calculateCompactResizeSteps(170, 2);

		assert.strictEqual(compactSteps, 3);
		assert.strictEqual(getTargetResizeSteps(false, 7, compactSteps), 7);
		assert.strictEqual(getTargetResizeSteps(true, 7, compactSteps), 3);
		assert.strictEqual(getTargetResizeSteps(true, 2, compactSteps), 2);
	});

	test('registers the sidebar resize command', async () => {
		const extension = vscode.extensions.all.find(
			(candidate) => candidate.packageJSON.name === 'vscode-sidebar-resize-half',
		);

		assert.ok(extension, 'Expected the extension to be installed in the test host');
		await extension.activate();

		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes(resizeCommandId));
	});
});
