# DIVERGENCES — where the two parsers disagree

Each entry is a minimized program that one parser accepts and the other
rejects (JS = the parse phase of `js/mpl.js`; ANTLR = the grammar via
`./gradlew parseCheck`). Divergences are recorded, never auto-fixed —
which parser is right is a ratification question for Stage 3. Rulings
happen in `JUDGMENT_CALLS.md`.

Entries below are appended by `conformance/harness/fuzz.mjs`
(deterministic: seed and index reproduce the original program), except
where a different source is noted.

## Divergence (found during C3 corpus construction)

```
✎ "drop\qme";
```

- JS interpreter: accepts (prints `dropqme` — an unknown string escape
  drops the backslash silently)
- ANTLR grammar: rejects (token recognition error at: '"drop\q')
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 49)

```

```

- JS interpreter: rejects (err_unexpected at 1:1)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 11)

```
"a\zb"
```

- JS interpreter: accepts (runs)
- ANTLR grammar: rejects (1:0: token recognition error at: '"a\z')
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 86)

```
((f);)
```

- JS interpreter: rejects (err_expect at 1:5)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 247)

```
(42;)
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 119)

```
(a;)
```

- JS interpreter: rejects (err_expect at 1:3)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 9)

```
(f∘g)
```

- JS interpreter: rejects (err_expect at 1:3)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 144)

```
({"",(a)})
```

- JS interpreter: rejects (err_expect at 1:5)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 456)

```
({"a b",2})
```

- JS interpreter: rejects (err_expect at 1:8)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 182)

```
({(007),true})
```

- JS interpreter: rejects (err_expect at 1:8)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 284)

```
({(1),⊥})
```

- JS interpreter: rejects (err_expect at 1:6)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 276)

```
({5,"a b"})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 427)

```
({b:y})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 101)

```
({c,0.5})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 425)

```
({g:⊥})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 194)

```
({x,(5)})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 212)

```
({y:"hi"})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 25)

```
({y:0})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 347)

```
({{},{}})
```

- JS interpreter: rejects (err_expect at 1:5)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 52)

```
({λ})
```

- JS interpreter: rejects (err_expect at 1:4)
- ANTLR grammar: accepts (parses)
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 76)

```
λ(b):(42)
```

- JS interpreter: accepts (runs)
- ANTLR grammar: rejects (1:4: mismatched input ':' expecting {<EOF>, ';', PARALLEL, LEFTARROW, IMPLIES, OR, AND, '=', NEQ, '<', '>', LEQ, GEQ, APPROX, SIM, '+', '-', TIMES, DIV, AST, COMPOSE, DEFINITION, HANDLE, ALLOC, RELEASE, '(', '|', MIDDOT})
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 13)

```
λ(f):42
```

- JS interpreter: accepts (runs)
- ANTLR grammar: rejects (1:4: mismatched input ':' expecting {<EOF>, ';', PARALLEL, LEFTARROW, IMPLIES, OR, AND, '=', NEQ, '<', '>', LEQ, GEQ, APPROX, SIM, '+', '-', TIMES, DIV, AST, COMPOSE, DEFINITION, HANDLE, ALLOC, RELEASE, '(', '|', MIDDOT})
- RULING: pending (see JUDGMENT_CALLS.md)

## Divergence (fuzz seed 20260709, index 29)

```
λ(y):f
```

- JS interpreter: accepts (runs)
- ANTLR grammar: rejects (1:4: mismatched input ':' expecting {<EOF>, ';', PARALLEL, LEFTARROW, IMPLIES, OR, AND, '=', NEQ, '<', '>', LEQ, GEQ, APPROX, SIM, '+', '-', TIMES, DIV, AST, COMPOSE, DEFINITION, HANDLE, ALLOC, RELEASE, '(', '|', MIDDOT})
- RULING: pending (see JUDGMENT_CALLS.md)
