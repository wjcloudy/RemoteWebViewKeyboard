// Browser-only test adapter; production input is supplied by the server bridge.
import { readFile } from 'node:fs/promises';
export async function getTouchKeyboardScript(config) {
  return `globalThis.__rwvInjectedScriptConfig = ${JSON.stringify({keyboard:config})};\n${await readFile(new URL('../dist/keyboard.js', import.meta.url), 'utf8')}`;
}
export async function installTouchKeyboard(session, config) {
  if (!config.enabled) return;
  let queue = Promise.resolve();
  session.on('Runtime.bindingCalled', event => {
    if (event.name !== '__rwvNativeInput') return;
    const input = JSON.parse(event.payload);
    queue = queue.then(async () => {
      if (input.type === 'text') await session.send('Input.insertText', {text:input.text});
      else {
        const code = {Backspace:8,Tab:9,Enter:13}[input.key];
        await session.send('Input.dispatchKeyEvent', {type:'keyDown',key:input.key,code:input.key,
          windowsVirtualKeyCode:code,nativeVirtualKeyCode:code,...(input.key==='Enter'?{text:'\r'}:{})});
        await session.send('Input.dispatchKeyEvent', {type:'keyUp',key:input.key,code:input.key,
          windowsVirtualKeyCode:code,nativeVirtualKeyCode:code});
      }
    });
  });
  await session.send('Runtime.enable');
  await session.send('Runtime.addBinding', {name:'__rwvNativeInput'});
  await session.send('Page.addScriptToEvaluateOnNewDocument', {source:await getTouchKeyboardScript(config)});
}
