# JUDGMENT_CALLS — semantic decisions awaiting ratification

RATIFIED 2026-07-09 — this file is the semantic record of MPL M0.

Every section below is a semantic question Stage 2 surfaced, stated with
the behavior `js/mpl.js` exhibited at observation time (Stage 2 head,
`ea66a2a`) and the corpus entries that pinned it. Each `RULING:` line
records Reverend's ratified decision of 2026-07-09. BLESS rulings kept the
observed behavior; OVERRIDE/SPLIT/IMPLEMENT/AMEND rulings changed the
grammar or the interpreter in Stage 3, and the corpus was re-recorded to
match. The "Observed:" text is the historical record, not the current
behavior — the rulings govern.

## 1. Division by zero

Question: what does `x ÷ 0` do — error, infinity, or ⊥?
Observed: raises `err_div0` (both `÷` and `/`, integer or float operands).
Pins: `043_div_zero`.

RULING: BLESS. `x ÷ 0` (and `/`) raises `err_div0`. Division by zero is undefined.

## 2. The value of a ∀ expression

Question: what does `∀ x ∈ list : body` evaluate to?
Observed: the value of the last body evaluation; `⊥` for an empty list.
Pins: `018_forall_value`, `019_forall_scope`.

RULING: OVERRIDE. `∀` is an iterator; the expression's value is `⊥` always (including empty collections). Using a statement as a value is undefined — same principle as ruling 3.

## 3. Result when no guard matches

Question: what is `(false ⟹ e)` with no `|` fallback?
Observed: an internal no-match that surfaces as `⊥` everywhere except
directly to the left of `|`.
Pins: `021_no_guard_match`, `023_alt_chain`.

RULING: BLESS (semantics, not mechanism). An unmatched guard yields `⊥` unless caught by `|`. Implementations choose their own internal sentinel.

## 4. Integer vs float display

Question: is `4 ÷ 2` shown as `2` or `2.0`? Are all numbers one type?
Observed: all numbers are IEEE doubles; integral values display with no
decimal point (`2`), non-integral as JS renders them (`0.5`, and
`0.1 + 0.2` shows `0.30000000000000004`). Literals normalize (`007` → `7`,
`0.50` → `0.5`).
Pins: `006_number_display`, `007_float_arithmetic`.

RULING: OVERRIDE. Numbers are exact rationals (arbitrary-precision integer numerator/denominator). Decimal literals convert exactly (`0.1` = 1/10). Display: integers bare; otherwise lowest-terms fraction `num/den`, sign on the numerator, denominator > 0; zero as `0`. Output is valid MPL that re-evaluates to the same value. IEEE doubles are rejected: the language must not lie about `0.1`. `√ vs ℚ` is logged as a standing M1 decision.

## 5. ✎ formatting per type

Question: exactly how does `✎` render each value type?
Observed: numbers via host `String()`; strings bare at top level but
quoted inside lists; booleans `true`/`false`; lists `[a, b]` with
one-space separation; closures as `λ`; `⊥` as `⊥`.
Pins: `009_string_concat`, `011_list_display`, `031_show_all_types`.

RULING: BLESS, spec'd. `✎` renders: numbers per ruling 4; strings bare at top level, double-quoted inside lists; booleans `true`/`false`; lists `[a, b]` (comma-space); closures as `λ`; `⊥` as `⊥`.

## 6. ⊥ display and propagation

Question: is `⊥` a first-class value or a poison that propagates?
Observed: a first-class value — it displays as `⊥`, concatenates into
strings (`"x" + ⊥` → `x⊥`), sits in lists, but arithmetic on it is
`err_num`.
Pins: `030_bot`, `052_bot_arith`.

RULING: BLESS. `⊥` is first-class: displays as `⊥`, sits in lists, string concatenation renders it (`"x" + ⊥` → `x⊥`); arithmetic on it is `err_num`.

## 7. Equality across types

Question: what does `=` mean across types and on structures?
Observed: structural (JSON-serialization) equality — lists compare
element-wise, cross-type comparisons are `false` (`1 = "1"` → `false`),
and `⊥ = ⊥` → `true`. Comparing a self-referential closure crashes with a
keyless host error (unpinnable by the corpus).
Pins: `034_cross_type_equality`, `033_string_compare`.

RULING: SPLIT. Data equality is structural: element-wise lists, cross-type `=` is `false`, `⊥ = ⊥` is `true`, `0.5 = 1/2` is `true` (same rational). Any equality comparison involving a function raises `err_fn_eq` — function equality is undecidable; a keyed error replaces the current keyless crash.

## 8. Ordering across types

Question: what do `< > ≤ ≥` do on mixed or non-numeric operands?
Observed: raw host comparison with JS coercion — `1 < "2"` → `true`,
`"10" < 9` → `false`, `true < 2` → `true`; strings order lexicographically.
Pins: `035_mixed_compare`, `033_string_compare`.

RULING: OVERRIDE. `< > ≤ ≥` are defined on number×number and string×string (Unicode code-point order) only; anything else raises `err_compare`. Host coercion (`1 < "2"`) is JavaScript soul leakage, not mathematics.

## 9. Closure capture

Question: do closures capture values at definition time or the
environment?
Observed: the environment — later mutation of a captured variable is
visible on the next call (`013` prints 11 then 21).
Pins: `013_closure_capture`, `026_def_vs_assign_scope`.

RULING: BLESS. Closures capture the environment. (The corpus itself forces this: `factorial` only works because the λ sees its own later binding.)

## 10. Recursion depth

Question: what bounds recursion, and how does exceeding it surface?
Observed: the host JS stack — deep recursion dies as a keyless RangeError
before the 500 000-step budget can trigger, so the corpus cannot pin it
(no error key). Iteration-heavy programs do hit the budget and raise
`err_steps`. Depth ~500 is comfortably safe.
Pins: `016_recursion_sum` (works at 500), `053_step_budget` (`err_steps`).

RULING: OVERRIDE. Recursion is bounded by an explicit λ-application depth counter, limit 10 000, raising `err_depth`. A keyless host RangeError is a hole in the error surface; the limit is conformance surface in every implementation.

## 11. The step budget itself

Question: is "500 000 evaluation steps, then `err_steps`" part of the
language, and is that the right number?
Observed: hard-coded 500 000; nested `∀` loops over a 10-element list six
deep exceed it.
Pins: `053_step_budget`.

RULING: RECLASSIFY. The step budget is an environment resource limit, not language semantics — like out-of-memory. `err_steps` (500 000) remains in the browser implementation; entry 053 leaves the portable corpus and becomes a js/test implementation test.

## 12. String escape round-tripping

Question: which string escapes exist, and what does an unknown one mean?
Observed: `\n` and `\t` expand; `\"` and `\\` escape themselves; any other
`\x` silently drops the backslash (`"drop\qme"` → `dropqme`). The ANTLR
grammar instead REJECTS unknown escapes — a recorded divergence.
Pins: `008_string_escapes`; divergence in DIVERGENCES.md ("drop\qme" and
the `"a\zb"` fuzz entry).

RULING: OVERRIDE. Escapes are exactly `\n \t \" \\`; any other `\x` raises `err_escape`, matching the grammar. Silent data-mangling is forbidden.

## 13. Guard condition truthiness

Question: what may a guard condition be?
Observed: `true` and non-zero numbers fire the guard; `false`, `0`,
strings, lists and `⊥` do not (they yield the no-match path) — so numbers
are truthy for `⟹` but nothing else is.
Pins: `022_guard_truthiness`.

RULING: OVERRIDE. A guard condition must be boolean; any non-boolean condition (numbers included) raises `err_bool`. A condition is a proposition.

## 14. ∧ ∨ operand truth

Question: do `∧`/`∨` accept the same truthiness as `⟹`?
Observed: no — operands are tested with strict boolean equality, so
`1 ∧ true` → `false` while `(1 ⟹ x)` fires. Both operators short-circuit
(observable by side effect). This asymmetry with #13 is the sharpest
accident in the surface.
Pins: `036_logic_ops`, `037_logic_short_circuit`.

RULING: SPLIT. `∧ ∨` short-circuit (blessed, observable by side effect) and demand boolean operands — a non-boolean evaluated operand raises `err_bool` instead of silently comparing false. One notion of truth, everywhere; an unevaluated right operand raises nothing.

## 15. Block scoping

Question: does `{ … }` create a scope?
Observed: no — bindings made inside a brace block leak out (`028` prints
9). Only λ bodies and each `∀` iteration scope.
Pins: `028_block_no_scope`, `027_block_sequencing`.

RULING: BLESS. Braces group; they do not scope. Scope is created by binders only (λ parameters, ∀ iteration variables) — the Curry-Howard reading: a discharged hypothesis IS a λ. An explicit local-binding construct (let/where) is logged as a standing M1 decision.

## 16. ≜ vs ← scoping and creation

Question: how do define and assign differ?
Observed: `≜` always binds in the current scope; `←` mutates the nearest
enclosing binding and silently creates one in the current scope when
nothing is bound (assignment-before-definition is legal). Both are
expressions returning the value; both rebind freely (`x ≜ 1; x ≜ 3` is
legal re-definition).
Pins: `024_def_assign_rebind`, `025_def_assign_value`,
`026_def_vs_assign_scope`.

RULING: OVERRIDE (both halves). `≜` introduces a name exactly once per scope — same-scope redefinition raises `err_redef`; shadowing in inner scopes is legal. `←` mutates the nearest enclosing binding and raises `err_unbound` when none exists — silent creation is the typo trap. Both remain expressions returning the value.

## 17. Type constraints

Question: does `λx∈ℕ:` constrain anything?
Observed: the constraint parses (including supplementary-plane `𝔹`) and
is discarded unevaluated — `g ≜ λs∈𝔹: s + "!"` happily takes a string.
Matches the site's "parsed today, not yet enforced" claim.
Pins: `039_type_constraint_unenforced`.

RULING: BLESS. Type constraints parse and are discarded, unenforced — this is the published claim and Stage 5's mandate.

## 18. Nullary calls and zero-parameter λ

Question: `f()` parses — but can any function be called that way?
Observed: no zero-parameter λ can be written (`λ: e` is a parse error),
so every `f()` is a runtime `err_arity`. The call syntax exists; nothing
can satisfy it.
Pins: `046_arity_nullary`, `047_arity_extra`.

RULING: AMEND GRAMMAR. Nullary functions exist: `λ: e` is admitted (bare colon; the parenthesized spelling stays rejected per ruling 25). Effects made M0 procedural the day `✎` entered it; arity 0 is not an exception to ℕ. `f()` calls it; arity mismatches remain `err_arity`.

## 19. ∗ as multiplication

Question: is `∗` (U+2217) an operator, and what does it mean?
Observed: exactly `×` — same token, same precedence.
Pins: `041_asterisk_multiplication`.

RULING: BLESS. `∗` (U+2217) is exactly `×`.

## 20. Divergence: empty program

Question: is the empty program valid?
Observed: the grammar accepts it; the JS interpreter rejects it
(`err_unexpected` at 1:1).
Pins: none possible until ruled (decision 3 — divergent programs cannot
enter the corpus). Repro in DIVERGENCES.md (fuzz index 49).

RULING: OVERRIDE. The empty program is valid and produces no output. The grammar is right; the interpreter accepts it.

## 21. Divergence: sequences inside parentheses

Question: is `( e1 ; e2 )` valid? DECISIONS.md says `(...)` contains one
seqExpr; the JS parser allows exactly one expression.
Observed: the grammar accepts `(42;)` and `(a; b)`; the JS interpreter
rejects both (`err_expect`).
Pins: none until ruled. Repros in DIVERGENCES.md (fuzz indexes 86, 119,
247, 233, 279, 406, 468, 101…).

RULING: OVERRIDE. Parentheses contain one seqExpr per the standing DECISIONS ruling: `(e1; e2)` is legal, value = last expression. The interpreter implements its own language.

## 22. Divergence: `∘` composition

Question: does function composition exist in M0?
Observed: the grammar parses `f ∘ g`; the JS interpreter lexes `∘` (it
even has the `\circ` escape) but has no parse rule for it — every use is
`err_expect`.
Pins: none until ruled. Repro in DIVERGENCES.md (fuzz index 9).

RULING: IMPLEMENT. `∘` is function composition: `(f ∘ g)(args…) = f(g(args…))`. Operands must be functions — a non-function operand raises the expected-a-function key (reuse the existing key if the audit finds one, else introduce `err_fn`). Precedence and associativity follow the grammar.

## 23. Divergence: set literals

Question: `{a, b}` is a set per the grammar's brace disambiguation — does
the M0 core have sets?
Observed: the grammar accepts `({5, "a b"})` and friends; the JS
interpreter has no set support and rejects them (`err_expect`).
Pins: none until ruled. Repros in DIVERGENCES.md (multiple fuzz indexes).

RULING: PARSE-ONLY. Set literals parse (the interpreter gains the grammar's brace disambiguation) and evaluation raises `err_notyet`. Set semantics are an M1 design, logged.

## 24. Divergence: record literals

Question: `{k: v}` is a record per the grammar — does the M0 core have
records?
Observed: the grammar accepts `({y: 0})`; the JS interpreter rejects
(`err_expect`).
Pins: none until ruled. Repros in DIVERGENCES.md (fuzz indexes 25, 212,
425, 427, 447).

RULING: PARSE-ONLY. Record literals: same as 23.

## 25. Divergence: parenthesized λ parameters

Question: DECISIONS.md rejected `λ(a, b):` as a second parameter spelling
— but who enforces that?
Observed: inverted from every other divergence — the GRAMMAR rejects
`λ(a, b): e` (honoring the decision) while the JS interpreter accepts it.
The interpreter carries a syntax form the language explicitly rejected.
Pins: none until ruled. Repros in DIVERGENCES.md (fuzz indexes 13, 29,
76, …).

RULING: OVERRIDE. `λ(a, b): e` is rejected by the interpreter too — the grammar already enforces the ratified DECISIONS ruling.

## 26. Divergence: bare λ and Greek letters as identifiers

Question: the grammar tokenizes Greek letters (LAMBDA_VAR et al.) as
identifiers, so `{λ}` parses; the JS interpreter only knows λ as the
abstraction head.
Observed: grammar accepts `({λ})`; JS rejects (`err_expect` — λ demands a
parameter list).
Pins: none until ruled. Repro in DIVERGENCES.md (fuzz index 52).

RULING: AMEND GRAMMAR. `λ` is a reserved token, never an identifier. Only λ; other Greek letters (π et al.) remain identifiers — Fatima wants π.
