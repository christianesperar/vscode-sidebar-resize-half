# Sidebar Resize Half

Toggle VS Code's primary sidebar between a wide and compact width while keeping the editor wider.

## Motivation

AI chat panels — like Copilot Chat, GitHub Copilot, and other LLM-powered assistants — live in the primary sidebar and benefit from extra screen real estate. This extension makes it easy to toggle the sidebar wide so the AI chat gets a good portion of the screen, then toggle it back to a compact size when you want more room for your code. One shortcut, no manual dragging.

## Usage

Run **Sidebar: Toggle Primary Sidebar Half Width** from the Command Palette, or use:

- macOS: `Ctrl+Option+B`
- Windows/Linux: `Ctrl+Alt+B`

On the first press, the command reads the frontmost VS Code window width, focuses and minimizes the primary sidebar, then grows it to no more than 45% of the window. Press it again to resize the sidebar to about twice its minimum width. Both targets are capped so the editor remains wider. It works whether the sidebar is positioned on the left or right.

The first use may ask for Automation or Accessibility permission. Enable Visual Studio Code under **System Settings > Privacy & Security** if macOS blocks the window-size query.

## Settings

- `sidebarResizeHalf.minimumSidebarWidth` is the assumed minimized sidebar width used in the macOS calculation. The default is `170` logical pixels.
- `sidebarResizeHalf.compactSizeMultiplier` controls the compact toggle target. The default is `2` times the minimum width.
- `sidebarResizeHalf.smoothResize` controls whether the sidebar animates step-by-step. When disabled (default), it jumps directly to the target size without animation.
- `sidebarResizeHalf.resizeSteps` is the fallback increment count when macOS window access is unavailable, and is always used on Windows and Linux.

## VS Code API Limitation

VS Code does not expose native workbench mouse events to extensions, so an extension cannot detect a double-click on the built-in sidebar or its resize sash. VS Code also does not expose an API for setting sidebar width to an exact percentage. On macOS this extension obtains the window width from System Events, but the final width is rounded to VS Code's supported 60-pixel resize increments.

This extension therefore provides the supported command and keyboard shortcut above. Exact native-sidebar double-click behavior will require VS Code to add a public workbench API.

## Development

Press `F5` to launch an Extension Development Host. Run `npm test` to compile, lint, and execute the extension test suite.

