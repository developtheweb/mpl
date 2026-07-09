# JUDGMENT_CALLS — semantic decisions awaiting ratification

Every section below is a semantic question the interpreter currently
answers by accident of implementation. Nothing here is ratified. Each
section states the question, what `js/mpl.js` observably does today, and
which corpus entries pin that behavior. The `RULING:` line is blank on
purpose — rulings are Reverend's, in Stage 3, in batches. A ruling either
blesses the observed behavior (the pinning entries flip to `ratified`) or
overrules it (the interpreter changes, the entries are re-recorded, then
ratified).

## 1. Division by zero

Question: what does `x ÷ 0` do — error, infinity, or ⊥?
Observed: raises `err_div0` (both `÷` and `/`, integer or float operands).
Pins: `043_div_zero`.

RULING:

## 2. The value of a ∀ expression

Question: what does `∀ x ∈ list : body` evaluate to?
Observed: the value of the last body evaluation; `⊥` for an empty list.
Pins: `018_forall_value`, `019_forall_scope`.

RULING:

## 3. Result when no guard matches

Question: what is `(false ⟹ e)` with no `|` fallback?
Observed: an internal no-match that surfaces as `⊥` everywhere except
directly to the left of `|`.
Pins: `021_no_guard_match`, `023_alt_chain`.

RULING:

## 4. Integer vs float display

Question: is `4 ÷ 2` shown as `2` or `2.0`? Are all numbers one type?
Observed: all numbers are IEEE doubles; integral values display with no
decimal point (`2`), non-integral as JS renders them (`0.5`, and
`0.1 + 0.2` shows `0.30000000000000004`). Literals normalize (`007` → `7`,
`0.50` → `0.5`).
Pins: `006_number_display`, `007_float_arithmetic`.

RULING:

## 5. ✎ formatting per type

Question: exactly how does `✎` render each value type?
Observed: numbers via host `String()`; strings bare at top level but
quoted inside lists; booleans `true`/`false`; lists `[a, b]` with
one-space separation; closures as `λ`; `⊥` as `⊥`.
Pins: `009_string_concat`, `011_list_display`, `031_show_all_types`.

RULING:

## 6. ⊥ display and propagation

Question: is `⊥` a first-class value or a poison that propagates?
Observed: a first-class value — it displays as `⊥`, concatenates into
strings (`"x" + ⊥` → `x⊥`), sits in lists, but arithmetic on it is
`err_num`.
Pins: `030_bot`, `052_bot_arith`.

RULING:

## 7. Equality across types

Question: what does `=` mean across types and on structures?
Observed: structural (JSON-serialization) equality — lists compare
element-wise, cross-type comparisons are `false` (`1 = "1"` → `false`),
and `⊥ = ⊥` → `true`. Comparing a self-referential closure crashes with a
keyless host error (unpinnable by the corpus).
Pins: `034_cross_type_equality`, `033_string_compare`.

RULING:

## 8. Ordering across types

Question: what do `< > ≤ ≥` do on mixed or non-numeric operands?
Observed: raw host comparison with JS coercion — `1 < "2"` → `true`,
`"10" < 9` → `false`, `true < 2` → `true`; strings order lexicographically.
Pins: `035_mixed_compare`, `033_string_compare`.

RULING:

## 9. Closure capture

Question: do closures capture values at definition time or the
environment?
Observed: the environment — later mutation of a captured variable is
visible on the next call (`013` prints 11 then 21).
Pins: `013_closure_capture`, `026_def_vs_assign_scope`.

RULING:

## 10. Recursion depth

Question: what bounds recursion, and how does exceeding it surface?
Observed: the host JS stack — deep recursion dies as a keyless RangeError
before the 500 000-step budget can trigger, so the corpus cannot pin it
(no error key). Iteration-heavy programs do hit the budget and raise
`err_steps`. Depth ~500 is comfortably safe.
Pins: `016_recursion_sum` (works at 500), `053_step_budget` (`err_steps`).

RULING:

## 11. The step budget itself

Question: is "500 000 evaluation steps, then `err_steps`" part of the
language, and is that the right number?
Observed: hard-coded 500 000; nested `∀` loops over a 10-element list six
deep exceed it.
Pins: `053_step_budget`.

RULING:

## 12. String escape round-tripping

Question: which string escapes exist, and what does an unknown one mean?
Observed: `\n` and `\t` expand; `\"` and `\\` escape themselves; any other
`\x` silently drops the backslash (`"drop\qme"` → `dropqme`). The ANTLR
grammar instead REJECTS unknown escapes — a recorded divergence.
Pins: `008_string_escapes`; divergence in DIVERGENCES.md ("drop\qme" and
the `"a\zb"` fuzz entry).

RULING:

## 13. Guard condition truthiness

Question: what may a guard condition be?
Observed: `true` and non-zero numbers fire the guard; `false`, `0`,
strings, lists and `⊥` do not (they yield the no-match path) — so numbers
are truthy for `⟹` but nothing else is.
Pins: `022_guard_truthiness`.

RULING:

## 14. ∧ ∨ operand truth

Question: do `∧`/`∨` accept the same truthiness as `⟹`?
Observed: no — operands are tested with strict boolean equality, so
`1 ∧ true` → `false` while `(1 ⟹ x)` fires. Both operators short-circuit
(observable by side effect). This asymmetry with #13 is the sharpest
accident in the surface.
Pins: `036_logic_ops`, `037_logic_short_circuit`.

RULING:

## 15. Block scoping

Question: does `{ … }` create a scope?
Observed: no — bindings made inside a brace block leak out (`028` prints
9). Only λ bodies and each `∀` iteration scope.
Pins: `028_block_no_scope`, `027_block_sequencing`.

RULING:

## 16. ≜ vs ← scoping and creation

Question: how do define and assign differ?
Observed: `≜` always binds in the current scope; `←` mutates the nearest
enclosing binding and silently creates one in the current scope when
nothing is bound (assignment-before-definition is legal). Both are
expressions returning the value; both rebind freely (`x ≜ 1; x ≜ 3` is
legal re-definition).
Pins: `024_def_assign_rebind`, `025_def_assign_value`,
`026_def_vs_assign_scope`.

RULING:

## 17. Type constraints

Question: does `λx∈ℕ:` constrain anything?
Observed: the constraint parses (including supplementary-plane `𝔹`) and
is discarded unevaluated — `g ≜ λs∈𝔹: s + "!"` happily takes a string.
Matches the site's "parsed today, not yet enforced" claim.
Pins: `039_type_constraint_unenforced`.

RULING:

## 18. Nullary calls and zero-parameter λ

Question: `f()` parses — but can any function be called that way?
Observed: no zero-parameter λ can be written (`λ: e` is a parse error),
so every `f()` is a runtime `err_arity`. The call syntax exists; nothing
can satisfy it.
Pins: `046_arity_nullary`, `047_arity_extra`.

RULING:

## 19. ∗ as multiplication

Question: is `∗` (U+2217) an operator, and what does it mean?
Observed: exactly `×` — same token, same precedence.
Pins: `041_asterisk_multiplication`.

RULING:

## 20. Divergence: empty program

Question: is the empty program valid?
Observed: the grammar accepts it; the JS interpreter rejects it
(`err_unexpected` at 1:1).
Pins: none possible until ruled (decision 3 — divergent programs cannot
enter the corpus). Repro in DIVERGENCES.md (fuzz index 49).

RULING:

## 21. Divergence: sequences inside parentheses

Question: is `( e1 ; e2 )` valid? DECISIONS.md says `(...)` contains one
seqExpr; the JS parser allows exactly one expression.
Observed: the grammar accepts `(42;)` and `(a; b)`; the JS interpreter
rejects both (`err_expect`).
Pins: none until ruled. Repros in DIVERGENCES.md (fuzz indexes 86, 119,
247, 233, 279, 406, 468, 101…).

RULING:

## 22. Divergence: `∘` composition

Question: does function composition exist in M0?
Observed: the grammar parses `f ∘ g`; the JS interpreter lexes `∘` (it
even has the `\circ` escape) but has no parse rule for it — every use is
`err_expect`.
Pins: none until ruled. Repro in DIVERGENCES.md (fuzz index 9).

RULING:

## 23. Divergence: set literals

Question: `{a, b}` is a set per the grammar's brace disambiguation — does
the M0 core have sets?
Observed: the grammar accepts `({5, "a b"})` and friends; the JS
interpreter has no set support and rejects them (`err_expect`).
Pins: none until ruled. Repros in DIVERGENCES.md (multiple fuzz indexes).

RULING:

## 24. Divergence: record literals

Question: `{k: v}` is a record per the grammar — does the M0 core have
records?
Observed: the grammar accepts `({y: 0})`; the JS interpreter rejects
(`err_expect`).
Pins: none until ruled. Repros in DIVERGENCES.md (fuzz indexes 25, 212,
425, 427, 447).

RULING:

## 25. Divergence: parenthesized λ parameters

Question: DECISIONS.md rejected `λ(a, b):` as a second parameter spelling
— but who enforces that?
Observed: inverted from every other divergence — the GRAMMAR rejects
`λ(a, b): e` (honoring the decision) while the JS interpreter accepts it.
The interpreter carries a syntax form the language explicitly rejected.
Pins: none until ruled. Repros in DIVERGENCES.md (fuzz indexes 13, 29,
76, …).

RULING:

## 26. Divergence: bare λ and Greek letters as identifiers

Question: the grammar tokenizes Greek letters (LAMBDA_VAR et al.) as
identifiers, so `{λ}` parses; the JS interpreter only knows λ as the
abstraction head.
Observed: grammar accepts `({λ})`; JS rejects (`err_expect` — λ demands a
parameter list).
Pins: none until ruled. Repro in DIVERGENCES.md (fuzz index 52).

RULING:
