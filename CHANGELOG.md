# Change Log

All notable changes to the "vscode-sidebar-resize-half" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.0.9]

- Fixed the toggle-back resize overshooting the editor.
- Cached the macOS window width so the resize starts instantly; the Automation permission warning now appears only once per session.
- Documented the webview keybinding limitation (e.g. Cline panels capture all keystrokes).

## [0.0.8]

- Disabled resize animation by default; added `smoothResize` setting to opt back in.
- Changed shortcut to `Ctrl+Option+B` (B for Bar/sidebar).
- Changed the compact toggle target to twice the minimum sidebar width.
- Capped the sidebar at 45% of the window so the editor remains wider.
- Reduced the no-permission fallback from 12 to 7 resize steps.
- Added toggling between half width and the default minimum sidebar width.
- Changed the macOS shortcut to `Ctrl+Option+H`.
- Added automatic half-window sidebar sizing on macOS using the frontmost window width.
- Added the primary sidebar resize command and default keyboard shortcuts.
- Added configurable resize increments for different window sizes.
