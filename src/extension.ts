import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as vscode from 'vscode';

export const resizeCommandId = 'vscode-sidebar-resize-half.resize';
const resetSteps = 40;
const resizeIncrement = 60;
const execFileAsync = promisify(execFile);

export function calculateResizeSteps(windowWidth: number, minimumSidebarWidth: number, maximumRatio = 0.45): number {
	return Math.max(0, Math.floor((windowWidth * maximumRatio - minimumSidebarWidth) / resizeIncrement));
}

export function calculateCompactResizeSteps(minimumSidebarWidth: number, multiplier: number): number {
	return Math.max(0, Math.round((minimumSidebarWidth * multiplier - minimumSidebarWidth) / resizeIncrement));
}

export function getTargetResizeSteps(isHalfWidth: boolean, halfWidthSteps: number, compactSteps: number): number {
	return isHalfWidth ? Math.min(compactSteps, halfWidthSteps) : halfWidthSteps;
}

async function getMacOsFrontWindowWidth(): Promise<number> {
	const script = `
tell application "System Events"
	set frontProcess to first application process whose frontmost is true
	set windowSize to size of front window of frontProcess
	return item 1 of windowSize
end tell`;
	const { stdout } = await execFileAsync('/usr/bin/osascript', ['-e', script], { encoding: 'utf8' });
	const width = Number.parseInt(stdout.trim(), 10);

	if (!Number.isFinite(width) || width <= 0) {
		throw new Error(`Unexpected window width: ${stdout.trim()}`);
	}

	return width;
}

async function getResizeSteps(
	configuration: vscode.WorkspaceConfiguration,
	minimumSidebarWidth: number,
): Promise<number> {
	const fallbackSteps = configuration.get<number>('resizeSteps', 7);

	if (process.platform !== 'darwin') {
		return fallbackSteps;
	}

	try {
		const windowWidth = await getMacOsFrontWindowWidth();
		const maximumSidebarRatio = configuration.get<number>('maximumSidebarRatio', 0.45);
		return calculateResizeSteps(windowWidth, minimumSidebarWidth, maximumSidebarRatio);
	} catch {
		void vscode.window.showWarningMessage(
			'Could not read the VS Code window size. Allow Automation or Accessibility access for Visual Studio Code in System Settings. Using the configured fallback size.',
		);
		return fallbackSteps;
	}
}

export function activate(context: vscode.ExtensionContext) {
	let isHalfWidth = false;
	let wideResizeSteps = 0;

	const disposable = vscode.commands.registerCommand(resizeCommandId, async () => {
		const configuration = vscode.workspace.getConfiguration('sidebarResizeHalf');

		try {
			const minimumSidebarWidth = configuration.get<number>('minimumSidebarWidth', 170);
			const compactSizeMultiplier = configuration.get<number>('compactSizeMultiplier', 2);
			const smoothResize = configuration.get<boolean>('smoothResize', false);
			const compactSteps = calculateCompactResizeSteps(minimumSidebarWidth, compactSizeMultiplier);
			if (!isHalfWidth) {
				wideResizeSteps = await getResizeSteps(configuration, minimumSidebarWidth);
			}

			const resizeSteps = getTargetResizeSteps(isHalfWidth, wideResizeSteps, compactSteps);
			await vscode.commands.executeCommand('workbench.action.focusSideBar');

			if (smoothResize) {
				for (let step = 0; step < resetSteps; step += 1) {
					await vscode.commands.executeCommand('workbench.action.decreaseViewSize');
				}

				for (let step = 0; step < resizeSteps; step += 1) {
					await vscode.commands.executeCommand('workbench.action.increaseViewSize');
				}
			} else {
				const promises: Thenable<unknown>[] = [];
				for (let step = 0; step < resetSteps; step += 1) {
					promises.push(vscode.commands.executeCommand('workbench.action.decreaseViewSize'));
				}
				for (let step = 0; step < resizeSteps; step += 1) {
					promises.push(vscode.commands.executeCommand('workbench.action.increaseViewSize'));
				}
				await Promise.all(promises);
			}

			isHalfWidth = !isHalfWidth;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			void vscode.window.showErrorMessage(`Unable to resize the sidebar: ${message}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
