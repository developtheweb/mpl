'use strict';
/* Interpreter tests — run with: node --test "js/test/*.test.mjs"
 * Asserts EXACT outputs for every program mpl.codes ships, so the site can
 * never claim an example works that doesn't. Migrated from the mpl_codes
 * test suite (test/mpl.test.js @ 5b50cc0) with every assertion's input and
 * expected value preserved exactly; only the runner mechanics changed.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runMPL, ESCAPES } from './load.mjs';
import { SYMBOLS, EXERCISES, DEFAULT_PROGRAM, HERO_PROGRAM } from './fixtures.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function run(src) {
  const out = [];
  runMPL(src, s => out.push(s));
  return out;
}

test('hero program computes factorial', () => {
  assert.deepEqual(run(HERO_PROGRAM), ['5! = 120']);
});

test('default playground program', () => {
  assert.deepEqual(run(DEFAULT_PROGRAM), ['Salaam, Fatima!', '5! = 120']);
});

const EXPECTED_EXERCISES = [
  ['Hello, World!', 'Jambo!', '你好!', 'مرحبا!'],
  ['Area = 15'],
  ['5! = 120'],
  ['Σ = 55'],
  ['2', '4', '6', '8'],
  ['42'],
];

test('all six exercises produce their documented output', () => {
  assert.equal(EXERCISES.length, EXPECTED_EXERCISES.length);
  EXERCISES.forEach((ex, i) => {
    assert.deepEqual(run(ex.code), EXPECTED_EXERCISES[i], `exercise ${i + 1}`);
  });
});

test('all six type symbols lex as inert ∈-constraint atoms', () => {
  // ℕ ℤ ℚ ℝ ℂ 𝔹 parse in constraint position and are discarded unevaluated
  // (§5: "parsed today, not yet enforced"). 𝔹 is supplementary-plane: the
  // lexer must treat the surrogate pair as one code point.
  for (const T of ['ℕ', 'ℤ', 'ℚ', 'ℝ', 'ℂ', '𝔹']) {
    assert.deepEqual(run(`f ≜ λx∈${T}: (x ⟹ 1) | 0;\n✎ f(true);`), ['1'],
      `type symbol ${T}`);
  }
});

test('𝔹 (U+1D539) lexes as one code point, not two surrogate halves', () => {
  // The exact gate case:
  assert.deepEqual(run('f ≜ λx∈𝔹: (x ⟹ 1) | 0; ✎ f(true);'), ['1']);
  // And no half-pair matching: 𝕊 (U+1D54A) shares 𝔹's high surrogate
  // \uD835 but is NOT a type symbol — it must be rejected whole.
  try {
    run('✎ 𝕊;');
    assert.fail('𝕊 should not lex');
  } catch (e) {
    assert.equal(e.key, 'err_char');
  }
});

test('vendored examples 01 and 02 run in the M0 browser core', () => {
  // 03–10 use constructs beyond the browser core (modules, resources,
  // channels, metaprogramming) — running them is deliberately NOT claimed.
  const ex = n => fs.readFileSync(path.join(__dirname, '..', '..', 'examples', n), 'utf8');
  assert.deepEqual(run(ex('01_hello_world.mpl')), ['Hello, World!']);
  assert.deepEqual(run(ex('02_factorial.mpl')), ['120']);
});

test('undefined name reports err_undef at 1:1', () => {
  try {
    run('x + 1;');
    assert.fail('should have thrown');
  } catch (e) {
    assert.equal(e.key, 'err_undef');
    assert.equal(e.line, 1);
    assert.equal(e.col, 1);
  }
});

test('division by zero reports err_div0', () => {
  try {
    run('✎ 1 ÷ 0;');
    assert.fail('should have thrown');
  } catch (e) {
    assert.equal(e.key, 'err_div0');
  }
});

test('SYMBOLS table: one escape per glyph, all escapes known to the lexer', () => {
  const glyphs = new Set();
  const escapes = new Set();
  for (const [glyph, esc] of SYMBOLS) {
    assert.ok(!glyphs.has(glyph), `duplicate glyph ${glyph}`);
    assert.ok(!escapes.has(esc), `duplicate escape ${esc}`);
    glyphs.add(glyph);
    escapes.add(esc);
    if (esc.startsWith('\\')) {
      // the palette's escape must be exactly what the lexer expands
      assert.equal(ESCAPES[esc.slice(1)], glyph,
        `lexer ESCAPES['${esc.slice(1)}'] must map to ${glyph}`);
    } else {
      // ASCII symbols (like |) are their own spelling
      assert.equal(esc, glyph);
    }
  }
});

test('every palette escape lexes identically to its glyph', () => {
  // One program that uses all fifteen backslash-escaped glyphs.
  const glyphProgram = [
    'check ≜ λa, b: ((a ≤ b) ∧ (b ≥ a) ∧ (a ≠ b) ⟹ ✎ "cmp") | ⊥;',
    'check(1, 2);',
    't ≜ 0;',   // ruling 16: first binding is ≜ (← still covered by the ∀ line)
    '∀ n ∈ [1, 2, 3]: t ← t + n;',
    '✎(t × 2);',
    '✎(t ÷ 2);',
    '✎((true ∨ false) ⟹ "or");',
  ].join('\n');
  // Verify coverage: every escaped SYMBOLS glyph appears in the program.
  for (const [glyph, esc] of SYMBOLS) {
    if (esc.startsWith('\\')) {
      assert.ok(glyphProgram.includes(glyph), `probe program must use ${glyph}`);
    }
  }
  // Build the escape-spelled variant (a space terminates each escape word).
  let escProgram = glyphProgram;
  for (const [glyph, esc] of SYMBOLS) {
    if (esc.startsWith('\\')) escProgram = escProgram.split(glyph).join(esc + ' ');
  }
  const expected = ['cmp', '12', '3', 'or'];
  assert.deepEqual(run(glyphProgram), expected);
  assert.deepEqual(run(escProgram), expected, 'escape spelling must behave identically');
});
