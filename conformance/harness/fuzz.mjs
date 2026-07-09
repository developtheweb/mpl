// Differential fuzzer: generates bounded, seeded, deterministic M0-core
// programs and feeds each to both parsers — the JS interpreter's parse
// phase and the ANTLR grammar via the ParseCheck CLI. Accept/reject
// disagreements are minimized (greedy unit removal preserving the
// disagreement) and appended to conformance/DIVERGENCES.md.
//
// Divergences are recorded, never auto-fixed: which parser is right is a
// ratification question (Stage 3), not a fuzzer's call.
//
// Usage: node conformance/harness/fuzz.mjs [--seed=N] [--n=N]
// Defaults: seed 20260709, n 500. Same seed + n → identical stdout, so
// two consecutive runs diff clean (the DIVERGENCES.md append is
// deduplicated by repro text and does not affect stdout).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { runMPL } = require('../../js/mpl.js');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, '..', '..');
const DIVERGENCES = path.join(HERE, '..', 'DIVERGENCES.md');

const argOf = (name, dflt) => {
  const a = process.argv.find(x => x.startsWith(`--${name}=`));
  return a ? Number(a.split('=')[1]) : dflt;
};
const SEED = argOf('seed', 20260709);
const N = argOf('n', 500);

// ---------------------------------------------------------------- PRNG --
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------- generator --
// Sticks to the M0-core surface SURFACE.md documents (no records, sets,
// modules, …) plus "spice" templates probing known-risky syntax edges.
// ‖ appears only as a parse probe; its semantics stay unpinned (decision 6).
function makeGen(rng) {
  const pick = xs => xs[Math.floor(rng() * xs.length)];
  const ids = ['a', 'b', 'c', 'f', 'g', 'x', 'y'];
  const nums = ['0', '1', '2', '5', '42', '1.5', '0.5', '007'];
  const strs = ['"hi"', '"a b"', '"x\\ny"', '"مرحبا"', '""'];

  function atom(d) {
    const r = rng();
    if (d <= 0) return r < 0.5 ? pick(nums) : pick(ids);
    if (r < 0.25) return pick(nums);
    if (r < 0.35) return pick(strs);
    if (r < 0.45) return pick(ids);
    if (r < 0.52) return pick(['true', 'false', '⊥']);
    if (r < 0.62) return `[${list(d - 1)}]`;
    if (r < 0.72) return `(${expr(d - 1)})`;
    if (r < 0.80) return `λ${params()}: ${expr(d - 1)}`;
    if (r < 0.86) return `∀ ${pick(ids)} ∈ [${list(d - 1)}]: ${expr(d - 1)}`;
    if (r < 0.93) return `{${expr(d - 1)}; ${expr(d - 1)}}`;
    return `${pick(ids)}(${rng() < 0.2 ? '' : list(d - 1)})`;
  }
  function params() {
    const n = rng() < 0.7 ? 1 : 2;
    const ps = Array.from({ length: n }, () => pick(ids)).join(', ');
    return rng() < 0.15 ? `${ps} ∈ ℕ` : ps;
  }
  function list(d) {
    const n = Math.floor(rng() * 3);
    return Array.from({ length: n + 1 }, () => expr(Math.max(0, d))).join(', ');
  }
  function expr(d) {
    if (d <= 0) return atom(0);
    const r = rng();
    if (r < 0.30) return `${expr(d - 1)} ${pick(['+', '-', '×', '÷', '/', '∗'])} ${atom(d - 1)}`;
    if (r < 0.42) return `${atom(d - 1)} ${pick(['=', '≠', '<', '>', '≤', '≥'])} ${atom(d - 1)}`;
    if (r < 0.50) return `${atom(d - 1)} ${pick(['∧', '∨'])} ${atom(d - 1)}`;
    if (r < 0.62) return `(${expr(d - 1)} ⟹ ${expr(d - 1)}) | ${atom(d - 1)}`;
    if (r < 0.68) return `✎ ${atom(d - 1)}`;
    if (r < 0.74) return `-${atom(d - 1)}`;
    if (r < 0.78) return `${pick(ids)} ‖ ${atom(d - 1)}`;
    return atom(d);
  }
  function stmt(d) {
    const r = rng();
    if (r < 0.35) return `${pick(ids)} ≜ ${expr(d)};`;
    if (r < 0.55) return `${pick(ids)} ← ${expr(d)};`;
    if (r < 0.8) return `✎(${expr(d)});`;
    return `${expr(d)};`;
  }
  // Known-risky syntax edges. Each is plausible M0-core spelling whose
  // acceptance the two parsers might not agree on.
  const spice = [
    d => `(${expr(d)}; ${expr(d)});`,
    d => `f ≜ λ(${pick(ids)}, ${pick(ids)}): ${expr(d)};`,
    () => `✎ "a\\${pick(['q', 'w', 'z'])}b";`,
    () => `✎(1e3);`,
    d => `✎(${atom(d)} < ${atom(d)} < ${atom(d)});`,
    () => `✎(f ∘ g);`,
    d => `a ≜ b ≜ ${expr(d)};`,
    d => `✎ ✎ ${atom(d)};`,
    d => `✎(- -${atom(d)});`,
    () => `f ≜ λ: 1;`,
    () => ``,
    d => `✎({${atom(d)}, ${atom(d)}});`,
    d => `✎({${pick(ids)}: ${atom(d)}});`,
    () => `✎(\\ast 2 3);`,
    d => `${expr(d)}`,               // no trailing semicolon
    d => `;${stmt(d)}`,              // leading semicolon
    () => `✎ 1;; ✎ 2;`,              // empty statement
    () => `✎ .5;`,                   // leading-dot number
    () => `✎ 1.;`,                   // trailing-dot number
    d => `∀ ${pick(ids)} ∈ ${atom(d)}: ${stmt(d)}`, // stmt as ∀ body
  ];
  return function program(idx) {
    const rBody = () => Array.from({ length: 1 + Math.floor(rng() * 3) },
      () => stmt(1 + Math.floor(rng() * 2))).join('\n');
    if (rng() < 0.35) {
      const s = pick(spice)(1);
      return rng() < 0.5 ? s : `${rBody()}\n${s}`;
    }
    return rBody();
  };
}

// --------------------------------------------------------- JS verdict --
const PARSE_KEYS = new Set(['err_char', 'err_escape', 'err_string',
  'err_comment', 'err_expect', 'err_unexpected', 'err_def_target',
  'err_assign_target']);

// accepts=true means "the JS parse phase accepted it" — runtime errors and
// keyless host crashes happen after parsing and count as accept.
function jsVerdict(src) {
  try {
    runMPL(src, () => {});
    return { accepts: true, detail: 'runs' };
  } catch (e) {
    if (e.key && PARSE_KEYS.has(e.key)) {
      return { accepts: false, detail: `${e.key} at ${e.line}:${e.col}` };
    }
    return { accepts: true, detail: e.key ? `runtime ${e.key}` : `host ${e.constructor.name}` };
  }
}

// ------------------------------------------------------ ANTLR verdict --
// ParseCheck is the CLI seam. Invoking it through gradle costs ~1s of JVM
// and build-system startup per call, which the minimizer cannot afford, so
// the classpath is resolved once and ParseCheck runs under plain `java`.
// Falls back to `./gradlew parseCheck` if the classpath cannot be found.
function resolveParseCheck() {
  execFileSync('./gradlew', ['-q', 'classes'], { cwd: REPO, stdio: 'ignore' });
  const classes = path.join(REPO, 'build', 'classes', 'java', 'main');
  const cache = path.join(os.homedir(), '.gradle', 'caches', 'modules-2',
    'files-2.1', 'org.antlr', 'antlr4-runtime');
  let jar = null;
  if (fs.existsSync(cache) && fs.existsSync(classes)) {
    const stack = [cache];
    while (stack.length) {
      const d = stack.pop();
      for (const f of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, f.name);
        if (f.isDirectory()) stack.push(p);
        else if (f.name.endsWith('.jar') && !f.name.includes('sources')) jar = p;
      }
    }
  }
  if (jar) return files => ['java', ['-cp', `${classes}:${jar}`, 'com.mpl.tools.ParseCheck', ...files]];
  return files => ['./gradlew', ['-q', 'parseCheck', `--args=${files.join(' ')}`]];
}
const parseCheckCmd = resolveParseCheck();
const antlrCache = new Map();

function antlrVerdicts(programs) {
  const result = new Array(programs.length);
  const misses = [];
  programs.forEach((p, i) => {
    if (antlrCache.has(p)) result[i] = antlrCache.get(p);
    else misses.push(i);
  });
  if (misses.length) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mplfuzz-'));
    const files = misses.map((mi, k) => {
      const f = path.join(dir, `p${String(k).padStart(4, '0')}.mpl`);
      fs.writeFileSync(f, programs[mi]);
      return f;
    });
    let stdout = '';
    const [cmd, args] = parseCheckCmd(files);
    try {
      stdout = execFileSync(cmd, args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      stdout = e.stdout || '';
    }
    const rejected = new Map();
    for (const line of stdout.split('\n')) {
      const m = line.match(/p(\d{4})\.mpl:(.*)$/);
      if (m) rejected.set(Number(m[1]), m[2].trim());
    }
    misses.forEach((mi, k) => {
      const v = rejected.has(k)
        ? { accepts: false, detail: rejected.get(k) }
        : { accepts: true, detail: 'parses' };
      antlrCache.set(programs[mi], v);
      result[mi] = v;
    });
    fs.rmSync(dir, { recursive: true, force: true });
  }
  return result;
}

// -------------------------------------------------------- minimization --
// Greedy unit removal: units are strings, escape words, identifiers,
// numbers, or single characters. Each round batch-checks every single-unit
// deletion and keeps the first candidate that preserves the disagreement.
const UNIT = /"(?:[^"\\]|\\.)*"|\\[a-zA-Z]+|[a-zA-Z][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+)?|\s+|./gsu;

// One reduction round over an array of parts: try deleting a window of w
// consecutive parts at every offset (largest w first), batch-checking the
// survivors; returns the first reduced array that preserves the
// disagreement, or null when no deletion does.
function reduceOnce(parts, joiner, wanted) {
  // All window sizes go into ONE batched ParseCheck call; the largest
  // window that preserves the disagreement wins.
  const candidates = [];
  for (let w = Math.min(8, parts.length - 1); w >= 1; w = Math.floor(w / 2)) {
    for (let i = 0; i + w <= parts.length; i++) {
      const cand = parts.slice(0, i).concat(parts.slice(i + w));
      if (jsVerdict(cand.join(joiner)).accepts === wanted.js) candidates.push({ w, cand });
    }
  }
  if (!candidates.length) return null;
  const antlr = antlrVerdicts(candidates.map(c => c.cand.join(joiner)));
  const hit = candidates.findIndex((c, i) => antlr[i].accepts === wanted.antlr);
  return hit === -1 ? null : candidates[hit].cand;
}

function minimize(src, wanted) {
  // Phase 1: whole lines. Phase 2: lexical units.
  let lines = src.split('\n').filter(l => l.trim() !== '');
  for (let r = 0; r < 30 && lines.length > 1; r++) {
    const red = reduceOnce(lines, '\n', wanted);
    if (!red) break;
    lines = red;
  }
  let units = lines.join('\n').match(UNIT) || [];
  for (let r = 0; r < 60 && units.length > 1; r++) {
    const red = reduceOnce(units, '', wanted);
    if (!red) break;
    units = red;
  }
  return units.join('').trim();
}

// ---------------------------------------------------------------- run --
const rng = mulberry32(SEED);
const gen = makeGen(rng);
console.log(`fuzz: seed=${SEED} n=${N}`);

const programs = Array.from({ length: N }, (_, i) => gen(i));
const js = programs.map(jsVerdict);
const antlr = antlrVerdicts(programs);

let agreeAccept = 0, agreeReject = 0;
const divergences = [];
for (let i = 0; i < N; i++) {
  if (js[i].accepts === antlr[i].accepts) {
    js[i].accepts ? agreeAccept++ : agreeReject++;
    continue;
  }
  divergences.push(i);
}
console.log(`agreement: ${agreeAccept} both-accept, ${agreeReject} both-reject`);
console.log(`disagreements: ${divergences.length}`);

// Minimize, dedupe by canonical shape (identifiers, numbers and string
// bodies normalized — `({b: y})` and `({g: ⊥})` share one root cause),
// report deterministically.
const canon = s => s
  .replace(/"(?:[^"\\]|\\.)*"/g, '"s"')
  .replace(/\b(?!true\b|false\b)[a-zA-Z][a-zA-Z0-9_]*\b/g, 'v')
  .replace(/[0-9]+(?:\.[0-9]+)?/g, '1')
  .replace(/\s+/g, ' ');
const seen = new Set();
const findings = [];
for (const i of divergences) {
  const wanted = { js: js[i].accepts, antlr: antlr[i].accepts };
  const repro = minimize(programs[i], wanted);
  const key = `${canon(repro)}|js=${wanted.js}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const [jsV] = [jsVerdict(repro)];
  const [antlrV] = antlrVerdicts([repro]);
  findings.push({ repro, index: i, jsV, antlrV });
}
findings.sort((a, b) => a.repro < b.repro ? -1 : a.repro > b.repro ? 1 : 0);

for (const f of findings) {
  console.log('---');
  console.log(`repro (seed ${SEED}, index ${f.index}):`);
  console.log(f.repro);
  console.log(`  js:    ${f.jsV.accepts ? 'ACCEPTS' : 'REJECTS'} (${f.jsV.detail})`);
  console.log(`  antlr: ${f.antlrV.accepts ? 'ACCEPTS' : 'REJECTS'} (${f.antlrV.detail})`);
}
console.log(`${findings.length} unique minimized divergences (recorded in conformance/DIVERGENCES.md)`);

// Append new findings to DIVERGENCES.md (dedup by repro text so reruns are
// idempotent; stdout above never depends on what was already in the file).
let doc = fs.existsSync(DIVERGENCES) ? fs.readFileSync(DIVERGENCES, 'utf8') : '';
let appended = '';
for (const f of findings) {
  if (doc.includes('```\n' + f.repro + '\n```')) continue;
  appended += `\n## Divergence (fuzz seed ${SEED}, index ${f.index})\n\n` +
    '```\n' + f.repro + '\n```\n\n' +
    `- JS interpreter: ${f.jsV.accepts ? 'accepts' : 'rejects'} (${f.jsV.detail})\n` +
    `- ANTLR grammar: ${f.antlrV.accepts ? 'accepts' : 'rejects'} (${f.antlrV.detail})\n` +
    `- RULING: pending (see JUDGMENT_CALLS.md)\n`;
}
if (appended) fs.writeFileSync(DIVERGENCES, doc + appended);
