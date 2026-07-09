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
- **Function calls are `f(a, b)` — a postfix argument list, nullary `f()` included**; rejected: Haskell juxtaposition `f x` (programmer convention, fails the Fatima test — children learn `f(x)` in school).
- **SEMICOLON has one role: sequence separator (trailing `;` permitted)**; the program, blocks, `(...)`, `⌈...⌉`, `〔...〕`, `⌜...⌝`, `⌞...⌟` and `⟳(...)` all contain one `seqExpr`; rejected: a separate statement-terminator rule duplicating the same token (two roles for one symbol).
- **Braces disambiguate structurally**: `IDENTIFIER :` → record, two-plus comma-separated exprs → set, everything else (incl. `{}` and `{x}`) → block; a singleton set literal cannot be written (deferred to M1); rejected: parser-order coin flips left undocumented.
- **`≜` defines, `←` assigns; both wired into the chain** with `≜` binding looser than `←`, both right-associative; rejected: `≜` tokenized but unreachable.
- **`⊕`/`⊖` are postfix resource operators** (`database ⊕`, `conn ⊖`), matching every example; rejected: prefix form `⊕open(path)` that appeared only in the whitepaper.
- **Channel operations are subscripted prefix operators** `⇀_ch expr` / `↽_ch expr`; rejected: leaving SEND/RECEIVE orphaned.
- **`‧` is qualified module access** (`Mathematics‧sin(angle)`), a postfix `‧IDENTIFIER`; rejected: leaving MIDDOT orphaned, or `.` (removed — one access syntax).
- **Handler clauses are `↯pattern ⟹ expr`, semicolon-separated**, where pattern is an identifier (binds the exception) or a string (matches a message); rejected: `↯e ⇒ expr` (⇒ is EXPORT; the clause arrow should mirror the guarded-alternative arrow ⟹).
- **IDENTIFIER may not start with `_`**, so subscripts (`⌉_db_lock`, `↽_socket`) lex as UNDERSCORE + IDENTIFIER; rejected: identifiers with a leading underscore (made every subscript lex as one identifier token).
- **`/` is an ASCII alias of ÷ (DIV)** so `π/4` parses; rejected: ÷-only division (unreachable on most keyboards).
- **Unary minus exists** (`-x`), sharing the MINUS token at prefix level; rejected: binary-only minus (cannot write negative numbers); unary plus was NOT added (`x ++ y` stays invalid).
- **`pathLiteral` accepts `🖫"…"` and `🖫identifier`**, as required by `readFile(🖫path)` in example 03.
- **Deleted tokens: `?` (QUERY), `∃` (EXISTS), `⇐` (IMPORT), `→` (ARROW), `.` (DOT)** — defined but used by no parser rule and no example; dead operators are debt; each returns in M1 only with a documented semantic. Rejected: keeping them tokenized-but-unreachable.
- **Exactly one ASCII escape per glyph** (`\lambda` not `\lam`, `\leftarrow` not `\gets`, `\neq` not `\ne`, `\nat` not `\N`, …); rejected: alias sets (two ways to write the same token).
- **`%` (modulo), `∑`, `√`, `²`, `|x|`, ranges `[a..b]`, indexing/slicing, `where`, and record field access are NOT in M0** — every document says so instead of using them; deferred to M1 with semantics, not smuggled in via prose.
- **Lambda parameters are a bare comma-separated pattern list** (`λa, b: body`); rejected: parenthesized parameter lists `λ(a, b):` (two ways to write parameters).
