# SURFACE — what `js/mpl.js` actually implements

Audited from the source of `js/mpl.js` at Stage 2 (C3, head `ea66a2a`) and
pinned by the corpus of that stage. **Historical record**: Stage 3 ratified
the 26 judgment calls (2026-07-09) and changed the surface where rulings
overrode it — rationals, boolean conditions, binding discipline, depth
limit, composition, and parser alignment. Where this file and
`JUDGMENT_CALLS.md` disagree, the rulings govern; the ratified corpus is
the executable truth.

## Lexer

- Whitespace: space, tab, CR, LF.
- Comments: line `-- …`; block `{- … -}`, nesting tracked (unterminated →
  `err_comment`).
- Strings: `"…"`, escape `\n` → newline, `\t` → tab, any other `\x` → `x`
  (the backslash is silently dropped — `\q` becomes `q`); unterminated →
  `err_string`.
- ASCII escapes: `\word` for word ∈ {lambda, forall, in, coloneq,
  leftarrow, implies, and, or, neq, leq, geq, times, div, trace, bot,
  parallel, circ, ast}; unknown word → `err_escape`.
- Numbers: `[0-9]+(.[0-9]+)?` via `parseFloat` (all numbers are JS
  doubles; no scientific notation, no leading `.`).
- Identifiers: `[a-zA-Z][a-zA-Z0-9_]*`; `true`/`false` are boolean
  literals. A leading `_` is not an identifier start (`err_char`).
- Type symbols `ℕ ℤ ℚ ℝ ℂ 𝔹` lex as identifiers (code-point-safe; 𝔹 is
  supplementary-plane).
- Single-char tokens: `✎ λ ∀ ∈ ≜ ← ⟹ ∧ ∨ ≠ ≤ ≥ × ÷ ∗ ∘ ‖ ⊥ + - / = < > |
  ; : , ( ) [ ] { }`.
- Anything else → `err_char`.

## Parser (loosest to tightest)

`;` sequence → `‖` (desugars to sequence!) → `≜` (right-assoc, id target
only) → `←` (right-assoc, id target only) → `|` (left-assoc) → `⟹`
(right-assoc) → `∨` → `∧` → comparison (`= ≠ < > ≤ ≥`, non-associative —
`1 < 2 < 3` is a parse error) → `+ -` → `× ∗ ÷ /` → unary (`✎`, `-`) →
call `f(a, …)` (postfix, nullary `f()` parses) → atom.

Atoms: number/string/bool literals, `⊥`, identifiers,
`λ params [∈ constraint] : body` (≥ 1 parameter; the constraint is parsed
and **discarded unevaluated**), `∀ id ∈ expr : body`, list `[…]`, parens
`( expr )` (a single expression — `;` inside parens is a parse error),
braces `{ seq }` (`{}` evaluates to `⊥`).

Parse-class error keys: `err_char`, `err_escape`, `err_string`,
`err_comment`, `err_expect`, `err_unexpected`, `err_def_target`,
`err_assign_target`.

Lexed but unusable: `∘` (compose) has a token and an escape but **no
parser rule** — any use is `err_expect`.

## Evaluator

- Values: number (double), string, boolean, list, closure, `⊥`.
- `✎ e` prints `show(value)` and returns the value.
- `show`: `⊥` → `⊥`; strings bare at top level but **quoted inside
  lists**; lists `[a, b]`; closures → `λ`; booleans `true`/`false`;
  numbers via JS `String()` (integral doubles print without `.0`).
- `+` is numeric addition unless either side is a string — then it is
  concatenation of `show`-rendered operands. `- × ∗ ÷ /` are numeric only
  (`err_num`), `÷ 0` → `err_div0`.
- Guards: `c ⟹ e` fires iff `c` is `true` **or a non-zero number**;
  strings/lists/`⊥` never fire. A non-firing guard yields NOMATCH, which
  `|` catches; NOMATCH surfacing anywhere else becomes `⊥`.
- `∧ ∨`: short-circuit; operands are tested with `=== true`, so non-boolean
  operands behave as false (`1 ∧ true` → `false` — contrast with `⟹`).
- Comparison: `=`/`≠` via JSON serialization (structural for lists,
  cross-type → `false`, `⊥ = ⊥` → `true`, comparing a self-referential
  closure crashes keyless); `< > ≤ ≥` are raw JS comparisons (mixed-type
  coercion applies).
- `≜` binds in the **current** scope; `←` mutates the nearest enclosing
  binding, creating one in the current scope if none exists. Both return
  the value; both may rebind.
- Braces `{…}` do **not** create a scope (bindings leak out). λ bodies and
  each `∀` iteration do (the `∀` variable shadows and is restored).
- Closures capture the defining **environment** (later mutations are
  visible), enabling recursion via `≜`.
- `∀ x ∈ list : body` requires a list (`err_iter`), evaluates the body per
  element, and yields the last body value (`⊥` for an empty list).
- Errors carry a key + 1-based line:col. Runtime keys: `err_undef`,
  `err_num`, `err_div0`, `err_notfn`, `err_arity`, `err_iter`,
  `err_steps` (evaluation-step budget: 500 000).
- Deep recursion overflows the host stack **before** the step budget —
  a keyless RangeError, unpinnable by the corpus (see JUDGMENT_CALLS).

## Grammar-only surface (no ruling, Stage 4+ material)

The grammar accepts these; the Stage-3 interpreter does not. No ruling
covers them and the fuzzer's generator does not emit them — they are on
the record here so the gap is a listed fact, not a surprise:

- `≈` (APPROX) and `∼` (SIM) comparison operators — interpreter: `err_char`.
- `"""raw strings"""` (RAWSTRING) — interpreter: `err_char` at the second
  quote pair's content or `err_string`/`err_expect` depending on context.
- Hex (`0x1F`), binary (`0b101`) and exponent (`1.5e3`) number literals —
  interpreter lexes the leading digits as a plain number and fails to
  parse the rest (`err_expect`).
- `_` as a λ pattern (patternAtom UNDERSCORE) — interpreter: `err_char`.

Dead key: `err_comment` can no longer be raised — since the comment lexer
matched the grammar (a `{-` without its `-}` is a brace, not an
unterminated comment), no code path produces it. It stays in the error-key
list pending removal at the next legitimate interpreter change (no hash
churn for hygiene alone).

## Explicitly out of corpus scope

- `‖` — parses, and the evaluator runs it as plain sequencing, but its
  semantics are an M1 design question (locked decision 6): no corpus
  entry pins it.
- Everything the grammar has that `js/mpl.js` does not implement (modules,
  resources, channels, exceptions, metaprogramming, records, sets, choice
  types, …) — Stage 4/5 artifacts, not Stage 2 ones.
