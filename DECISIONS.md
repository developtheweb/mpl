# Design decisions

One line per decision, with the rejected alternatives named. Governing
principles, in order: One Right Answer, the Fatima test, minimal churn
against the existing examples.

- **Conditionals are guarded alternatives** `(condition ⟹ result) | fallback`, wired in as a `condExpr` precedence level; rejected: C-style ternary `cond ? a : b` (programmer convention, fails the Fatima test), standalone left-recursive `conditional` rule (ANTLR error 119).
- **Exception handling is a postfix operator** `expr ↴ { … }`; rejected: standalone `exceptionHandler` rule reachable from `atomExpr` (mutual left recursion, ANTLR error 119).
- **λ has one token, `LAMBDA_VAR`**, used both as a variable and to open a lambda; rejected: separate `LAMBDA` token (identical alternatives, fully shadowed, ANTLR warning 184).
- **`\implies` maps to ⟹ and `\Rightarrow` maps to ⇒** — one escape, one glyph; rejected: `\Rightarrow` as an alias of ⟹ (shadowed EXPORT's escape, ANTLR warning 184).
- **The Java package for generated code comes from `-package` in build.gradle only**; rejected: `@header` package declaration in the grammar (combined with `-package` it generates a duplicate `package` statement that does not compile).
- **ANTLR warnings fail the build** (`-Werror` in build.gradle); rejected: warnings as advisory output (they hid the shadowed-token bugs).
- **The choice-type rule is `⟨ expr ⟩`** with the interior `|` consumed by `condExpr`; rejected: explicit `⟨ expr | expr ⟩` (the interior expr already consumes the bar, making the explicit BAR unreachable).
