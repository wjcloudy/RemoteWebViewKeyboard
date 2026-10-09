export function readKeyboardConfig(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new Error('Invalid keyboard configuration');
  const bool = (key, fallback) => {
    const value = options[key] ?? fallback;
    if (typeof value !== 'boolean') throw new Error(`Invalid keyboard option: ${key}`);
    return value;
  };
  const choice = (key, choices, fallback) => {
    const value = options[key] ?? fallback;
    if (!choices.includes(value)) throw new Error(`Invalid keyboard option: ${key}`);
    return value;
  };
  const integer = (key, min, max, fallback) => {
    const value = options[key] ?? fallback;
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`Invalid keyboard option: ${key}`);
    return value;
  };
  const config = {
    enabled: bool('enabled', true), showButton: bool('showButton', true),
    layout: choice('layout', ['qwerty', 'qwertz', 'azerty'], 'qwerty'),
    theme: choice('theme', ['dark', 'light', 'auto'], 'dark'),
    position: choice('position', ['bottom-right', 'bottom-left'], 'bottom-right'),
    autoOpen: bool('autoOpen', false), longPress: bool('longPress', false),
    cornerHold: bool('cornerHold', false),
    shortcutCorner: choice('shortcutCorner', ['bottom-right', 'bottom-left', 'top-right', 'top-left'], 'bottom-right'),
    cornerSize: integer('cornerSize', 24, 96, 48),
    longPressMs: integer('longPressMs', 300, 2000, 650),
  };
  if (config.enabled && !config.showButton && !config.autoOpen && !config.longPress && !config.cornerHold) {
    throw new Error('Keyboard needs an opening method');
  }
  return config;
}
