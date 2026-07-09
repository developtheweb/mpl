// Conformance harness — zero dependencies (node:test not even needed:
// entries are data, not code). See conformance/README notes in SURFACE.md.
//
// Modes:
//   --all       run every corpus entry; informational; exit 0 unless the
//               harness itself errors (malformed entry, unreadable corpus)
//   --ratified  run only entries with "status": "ratified"; exit 0 iff all
//               pass; exits 0 vacuously when zero entries are ratified.
//               This is what CI gates on.
//
// Every case is executed twice and the observations compared; a mismatch is
// a determinism failure (NONDET) and fails the case.
//
// Expectations (exactly one per entry):
//   expected.out — exact stdout, single trailing newline normalized
//   expected.err — the interpreter's error KEY (e.g. err_div0), one per
//                  line; never localized message text
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Same loader mechanism as js/test/load.mjs: the artifact is CommonJS-
// guarded; the loader adapts, the artifact is never modified.
const require = createRequire(import.meta.url);
const { runMPL } = require('../../js/mpl.js');

const CORPUS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'corpus');

function harnessError(msg) {
  console.error(`harness error: ${msg}`);
  process.exit(2);
}

// One observation: printed lines plus the error key (null if none thrown).
// A keyless exception is recorded distinctly — it is a host-level crash,
// not an MPL error, and can never match an expected.err key.
function observe(src) {
  const lines = [];
  try {
    runMPL(src, s => lines.push(s));
    return { lines, key: null };
  } catch (e) {
    return { lines, key: e.key || `UNKEYED:${e.constructor.name}` };
  }
}

// Exact stdout with a single trailing newline normalized on both sides.
const norm = s => (s === '' ? '' : s.replace(/\n*$/, '') + '\n');

function loadEntry(dir) {
  const p = n => path.join(CORPUS, dir, n);
  if (!fs.existsSync(p('program.mpl'))) harnessError(`${dir}: missing program.mpl`);
  if (!fs.existsSync(p('meta.json'))) harnessError(`${dir}: missing meta.json`);
  let meta;
  try { meta = JSON.parse(fs.readFileSync(p('meta.json'), 'utf8')); }
  catch (e) { harnessError(`${dir}: bad meta.json: ${e.message}`); }
  if (meta.status !== 'unratified' && meta.status !== 'ratified') {
    harnessError(`${dir}: meta.status must be "unratified" or "ratified"`);
  }
  const hasOut = fs.existsSync(p('expected.out'));
  const hasErr = fs.existsSync(p('expected.err'));
  if (hasOut === hasErr) harnessError(`${dir}: need exactly one of expected.out / expected.err`);
  return {
    dir,
    meta,
    program: fs.readFileSync(p('program.mpl'), 'utf8'),
    out: hasOut ? fs.readFileSync(p('expected.out'), 'utf8') : null,
    err: hasErr ? fs.readFileSync(p('expected.err'), 'utf8').split('\n').filter(Boolean) : null,
  };
}

function runEntry(e) {
  const first = observe(e.program);
  const second = observe(e.program);
  if (JSON.stringify(first) !== JSON.stringify(second)) {
    return { verdict: 'NONDET', detail: 'two runs disagreed' };
  }
  if (e.out !== null) {
    if (first.key !== null) return { verdict: 'FAIL', detail: `threw ${first.key}, expected output` };
    const actual = first.lines.length ? first.lines.join('\n') + '\n' : '';
    if (norm(actual) !== norm(e.out)) {
      return { verdict: 'FAIL', detail: `output ${JSON.stringify(actual)} != expected ${JSON.stringify(norm(e.out))}` };
    }
    return { verdict: 'PASS' };
  }
  const keys = first.key === null ? [] : [first.key];
  if (JSON.stringify(keys) !== JSON.stringify(e.err)) {
    return { verdict: 'FAIL', detail: `error keys ${JSON.stringify(keys)} != expected ${JSON.stringify(e.err)}` };
  }
  return { verdict: 'PASS' };
}

const mode = process.argv[2];
if (mode !== '--all' && mode !== '--ratified') {
  harnessError('usage: node conformance/harness/run.mjs --all | --ratified');
}

if (!fs.existsSync(CORPUS)) harnessError(`no corpus directory at ${CORPUS}`);
let dirs = fs.readdirSync(CORPUS).filter(d => fs.statSync(path.join(CORPUS, d)).isDirectory()).sort();
const entries = dirs.map(loadEntry);
const selected = mode === '--ratified' ? entries.filter(e => e.meta.status === 'ratified') : entries;

if (mode === '--ratified' && selected.length === 0) {
  console.log('0 entries ratified — vacuously green (ratification is Stage 3).');
  process.exit(0);
}

let pass = 0, fail = 0;
for (const e of selected) {
  const r = runEntry(e);
  if (r.verdict === 'PASS') pass++; else fail++;
  console.log(`${r.verdict} ${e.dir}${r.detail ? ' — ' + r.detail : ''}`);
}
console.log(`${selected.length} cases: ${pass} pass, ${fail} fail (${entries.length - selected.length} not selected)`);
process.exit(mode === '--ratified' && fail > 0 ? 1 : 0);
