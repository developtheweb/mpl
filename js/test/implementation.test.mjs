'use strict';
/* Implementation-limit tests — run with: node --test "js/test/*.test.mjs"
 * Ruling 11: the step budget is an environment resource limit of THIS
 * implementation, not language semantics. The portable conformance corpus
 * does not pin it (former entry 053 moved here).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { runMPL } from './load.mjs';

test('the 500000-step budget raises err_steps (ruling 11)', () => {
  const src = 'l ≜ [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];\n' +
    '∀ a ∈ l: ∀ b ∈ l: ∀ c ∈ l: ∀ d ∈ l: ∀ e ∈ l: ∀ f ∈ l: 0;\n';
  try {
    runMPL(src, () => {});
    assert.fail('should have hit the step budget');
  } catch (e) {
    assert.equal(e.key, 'err_steps');
  }
});
