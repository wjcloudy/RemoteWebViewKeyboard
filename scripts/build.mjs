import { readFile, mkdir, writeFile } from 'node:fs/promises';
const parts = await Promise.all(['config.js', 'keyboard.js'].map(name => readFile(new URL('../src/' + name, import.meta.url), 'utf8')));
const source = `/* RemoteWebViewKeyboard - Copyright (c) 2026 wjcloudy. MIT licensed. */\n(() => {\n${parts.map(s => s.replace(/^export /gm, '')).join('\n')}\ntry {\n  const config = readKeyboardConfig(globalThis.__rwvInjectedScriptConfig?.keyboard);\n  if (config.enabled) installKeyboard(config);\n} catch { console.warn('Touch keyboard configuration is invalid; keyboard not installed.'); }\n})();\n`;
await mkdir(new URL('../dist/', import.meta.url), {recursive: true});
await writeFile(new URL('../dist/keyboard.js', import.meta.url), source);
