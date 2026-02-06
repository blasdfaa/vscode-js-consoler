# JS Consoler

Quickly insert `console.log()` for selected code in VS Code.

Select a variable or expression, hit the shortcut — a `console.log()` with a label appears on the next line, properly indented.

## Usage

1. Select text in the editor
2. Press `Cmd+Shift+L` (Mac) / `Ctrl+Shift+L` (Windows/Linux)

```js
const user = getUser()
// Select `user`, press the shortcut, and get:
console.log('user', user)
```

Without selection, an empty `console.log()` is inserted.

## Configuration

| Key | Description | Default |
| --- | --- | --- |
| `js-consoler.logTemplate` | Log statement template. `{selected}` is replaced with the selected text. | `console.log('{selected}', {selected})` |

### Template examples

```jsonc
// Default
"js-consoler.logTemplate": "console.log('{selected}', {selected})"

// Labeled with emoji
"js-consoler.logTemplate": "console.log('🔍 {selected}:', {selected})"

// console.warn
"js-consoler.logTemplate": "console.warn('{selected}', {selected})"

// JSON output
"js-consoler.logTemplate": "console.log(JSON.stringify({selected}, null, 2))"
```

## Keybinding

Default: `Cmd+Shift+L` / `Ctrl+Shift+L`. Rebind via `Preferences: Open Keyboard Shortcuts` and search for `Insert Console Log`.

## License

[MIT](./LICENSE.md)
