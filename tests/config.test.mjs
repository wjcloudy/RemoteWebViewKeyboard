import test from 'node:test';
import assert from 'node:assert/strict';
import { readKeyboardConfig } from '../src/config.js';
test('button default and configurable corner-only opening', () => {
  assert.equal(readKeyboardConfig().showButton,true);
  const config=readKeyboardConfig({showButton:false,cornerHold:true,shortcutCorner:'top-left',longPressMs:900});
  assert.equal(config.autoOpen,false); assert.equal(config.shortcutCorner,'top-left'); assert.equal(config.longPressMs,900);
});
test('reject invalid options and an enabled keyboard with no opening method', () => {
  for (const options of [null,[],{showButton:'false'},{layout:'invalid'},{shortcutCorner:'middle'},
    {cornerSize:23},{cornerSize:97},{longPressMs:299},{longPressMs:2001},{longPressMs:1.5},{showButton:false}]) {
    assert.throws(()=>readKeyboardConfig(options));
  }
  assert.equal(readKeyboardConfig({enabled:false,showButton:false}).enabled,false);
});
