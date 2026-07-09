// Single shared loader for the interpreter artifact. js/mpl.js must stay
// byte-identical to the file served at mpl.codes, so the loader adapts to
// the artifact — never the other way around. The artifact ends with a
// CommonJS export guard, so createRequire is sufficient today; if that
// guard ever changes, adapt here (e.g. node:vm), do not edit js/mpl.js.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { runMPL, ESCAPES } = require('../mpl.js');

export { runMPL, ESCAPES };
