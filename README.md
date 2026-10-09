# Remote WebView Keyboard

A configurable touch keyboard for streamed browser displays. MIT licensed.
The keyboard is maintained separately from RemoteWebViewServer and loaded using
its `INJECT_JS_URL` hook. Existing RemoteWebViewClient/ESPHome touch events work
without a firmware update.

## Install

Use the [wjcloudy server fork](https://github.com/wjcloudy/RemoteWebViewServer)
with its optional native input bridge. Set these container environment variables:

```yaml
INJECT_JS_URL: https://raw.githubusercontent.com/wjcloudy/RemoteWebViewKeyboard/v1.0.0/dist/keyboard.js
INJECT_JS_NATIVE_INPUT: 'true'
INJECT_JS_CONFIG: '{"keyboard":{"showButton":false,"cornerHold":true,"shortcutCorner":"bottom-right","longPressMs":650}}'
```

Tap a text field, then hold the bottom-right 48-pixel corner for 650 ms.
Close hides the keyboard. Short corner taps still reach the page. Moving more
than 12 pixels, releasing early, scrolling, a cancelled touch or a second finger
cancels the shortcut. A completed hold consumes its release click.

Pin the script to a release or full commit rather than `main`. Set
`INJECT_JS_SHA256` to the file's SHA-256 to verify the downloaded bytes. Changes
apply when the server restarts. Keyboard-only updates do not need a server image
release. Configuration can also be supplied per display using the server's
`injectJsConfig` URL parameter (JSON, URL-encoded).

Stock upstream supports external scripts but does not provide this keyboard's
native input binding. The bridge preserves browser editing and trusted input
events; this project does not substitute direct field-value changes.

## Options

Options belong in the `keyboard` object in `INJECT_JS_CONFIG`.

| Option | Default | Values |
| --- | --- | --- |
| `enabled` | `true` | Boolean |
| `showButton` | `true` | Show a persistent keyboard button |
| `autoOpen` | `false` | Open when an editable field is focused or tapped |
| `longPress` | `false` | Open when an editable field is held |
| `cornerHold` | `false` | Open when the selected screen corner is held |
| `shortcutCorner` | `bottom-right` | `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `cornerSize` | `48` | Integer from 24 to 96 pixels |
| `longPressMs` | `650` | Integer from 300 to 2000 milliseconds |
| `layout` | `qwerty` | `qwerty`, `qwertz`, `azerty` |
| `theme` | `dark` | `dark`, `light`, `auto` |
| `position` | `bottom-right` | `bottom-right`, `bottom-left` (panel/button placement) |

Opening methods can be combined. Hiding the button requires another opening
method. Invalid settings prevent installation and produce a generic warning.
Disabled and read-only fields do not trigger focus/field-hold opening. The corner
can open the keyboard before a field is selected; tap a field to type into it.
Escape also closes it.

QWERTZ includes German umlauts; AZERTY includes French accents on the second
symbol page. Keys include case, symbols, Backspace, Tab, Space and Enter.
The panel adapts to the viewport and moves above fields in the lower half.
Controls are English. These are Latin layouts, not an IME.

## Privacy and compatibility

The component does not read field values, store or log typed text, or make
network requests. The server bridge accepts short text and Backspace/Tab/Enter
from the current main document, with a bounded ordered queue. Browser validation,
selection, maxlength, number fields, textarea newlines and form submission use
native Chromium behavior. Page scripts can cancel input as usual.

Editable controls in open shadow roots are detected. Closed roots and embedded
frames can use the manual button/corner shortcut after focusing the field.
Protect the streaming server as you would without the keyboard. An injected
script has page access: only install code you trust.

## Development

Run `npm ci`, `npm run build`, `npm test`, then `npm run test:browser`.
Set `KEYBOARD_TEST_CHROMIUM` to a local Chromium/Chrome executable if needed.
Tests use synthetic forms and native Chromium touch/input events. The test input
adapter is not production server code; the server repository separately tests
its bridge's validation, context isolation and built-image external injection.
Commit the generated `dist/keyboard.js` so the direct URL is installable.
