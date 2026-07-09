# Mathematical Programming Language (MPL)

This is the language specification. The single source of truth for what
parses is the grammar, [`src/main/antlr4/MPL.g4`](src/main/antlr4/MPL.g4);
every symbol and example below is part of the M0 grammar unless explicitly
marked "M1".

## Core Symbol Set (M0)

### Mathematical Foundation (LaTeX)
- **Variables:** α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω
- **Collections:** ∅,∈
- **Logic:** ∧,∨,⟹,∀
- **Operations:** +,-,×,÷ (ASCII alias `/`),∗,∘
- **Relations:** =,≠,<,>,≤,≥,≈,∼
- **Functions:** λ (calls are `f(a, b)`)
- **Assignment:** ←
- **Definition:** ≜
- **Structure:** (),[],{},⟨⟩

### Effect Extensions
- **↯** Raise exception
- **↴** Handle exception (postfix: `expr ↴ { ↯pattern ⟹ expr }`)
- **‖** Parallel composition
- **⌈⌉** Atomic section/lock (optional subscript: `⌈…⌉_lock`)
- **⊕** Allocate resource (postfix: `database ⊕`)
- **⊖** Release resource (postfix: `conn ⊖`)
- **𝓜** Module declaration
- **⇒** Export
- **‧** Qualified module access (`Mathematics‧sin`)
- **⇀** Send to channel (`⇀_ch expr`)
- **↽** Receive from channel (`↽_ch expr`)

### Additional Operators
- **⟨v|e⟩** Choice type (value or error)
- **🖫** File path prefix (`🖫"file.txt"` or `🖫identifier`)
- **⌜⌝** Code quotation
- **⌞⌟** Code evaluation
- **⧈** Breakpoint
- **✎** Trace/log (the one output operator)
- **⏲** Delay
- **⟳** Periodic task
- **〔〕** RAII scope

### Reserved for M1 (not in the grammar)
∪,∩,⊂,⊃,⊆,⊇,∉ (set algebra); ¬,⟺,∃ (extended logic); → (function
types); ⇐ (import); ⇡⇣ (stream positioning); ⇆ (atomic swap); ⟪⟫ (deep
update); ? (introspection); ∑,√,²,% (arithmetic extensions). Each returns
only together with a defined semantic.

## Grammar

The sketches below are illustrative; [`MPL.g4`](src/main/antlr4/MPL.g4) is
normative.

### Basic Expressions
```
expr ::= variable | literal | operation | function_call | block

variable ::= identifier | α | β | γ | ... | ω
literal ::= number | string | path | list | set | record
operation ::= expr OP expr
function_call ::= f(expr, ...)          -- the one call syntax; f() is legal
block ::= { expr; expr; ... }           -- ; separates, trailing ; permitted
```

### Expression Forms
```
assignment ::= expr ← expr
definition ::= expr ≜ expr
conditional ::= (condition ⟹ result) | fallback     -- guarded alternatives
iteration ::= ∀pattern∈domain: expr
lambda ::= λpattern: expr | λpattern∈domain: expr
parallel ::= expr ‖ expr
atomic ::= ⌈expr⌉ | ⌈expr⌉_lock
exception ::= ↯expr | expr ↴ {↯pattern ⟹ handler; ...}
```

### Types
```
basic_type ::= ℕ | ℤ | ℚ | ℝ | ℂ | 𝔹
choice_type ::= ⟨type|type⟩
function_type ::= domain → codomain     -- M1
effect_type ::= type^effect             -- M1
```

## Example Programs

These are the ten programs in [`examples/`](examples/), verbatim; CI parses
them on every push (`./gradlew parseExamples`).

### Hello World
```mpl
-- Hello World example
✎"Hello, World!";
```

### Factorial
```mpl
-- Factorial example with proper precedence
factorial ≜ λn∈ℕ: (n≤1 ⟹ 1) | (n×factorial(n-1));
result ← factorial(5);
✎result;
```

### File Processing with Error Handling
```mpl
-- File processing with error handling
processFile ≜ λpath: {
    data ← readFile(🖫path);
    result ← transform(data);
    writeFile(result, 🖫"output.txt");
    ⟨"success"|"failed"⟩
} ↴ {↯e ⟹ ⟨⊥|e⟩};
```

### Concurrent Download
```mpl
-- Concurrent download with parallelism
downloadAll ≜ λurls: ∀url∈urls: (
    fetchData(url) ‖ processData(url)
) ⟹ mergeResults();
```

### Module Definition
```mpl
-- Module definition example
𝓜 Mathematics ⇒ {
    π ≜ 3.14159;
    sin ≜ λx∈ℝ: ⊥ {- implementation deferred until MPL executes -};
    cos ≜ λx∈ℝ: ⊥ {- implementation deferred until MPL executes -}
};

angle ← π/4;
result ← Mathematics‧sin(angle);
```

### Resource Management
```mpl
-- Resource management with RAII
databaseQuery ≜ λquery: 〔
    conn ← database ⊕;
    ⌈
        result ← execute(conn, query);
        ✎"Query executed";
        result
    ⌉_db_lock
    {- conn ⊖ happens automatically at end of 〔〕 -}
〕;
```

### Metaprogramming
```mpl
-- Metaprogramming with code quotation
generateFunction ≜ λname: ⌜
    λx: x × 2
⌝;

doubler ← ⌞generateFunction("doubler")⌟;
result ← doubler(21);
```

### Real-time System
```mpl
-- Real-time scheduler with periodic tasks
scheduler ≜ ⟳(
    tasks ← getPendingTasks();
    ∀task∈tasks: execute(task) ‖ monitor(task),
    100ms
);
```

### Network Server
```mpl
-- Network server with connection handling
server ≜ λport: 〔
    socket ← bind(port) ⊕;
    ∀request∈acceptLoop(socket): (
        data ← ↽_socket request;
        response ← processRequest(data);
        ⇀_socket response
    ) ‖ handleNext()
    {- socket ⊖ happens automatically at end of 〔〕 -}
〕;
```

### Type-safe Database
```mpl
-- Type-safe database with refinement types
User ≜ {name: String, age: ℕ | age>0, email: String};
query ≜ λtable∈Database: ∀row∈table: validateUser(row) ↴ {
    ↯"Invalid user" ⟹ ⊥
};
```

## Critical Implementation Decisions

### Lexical Layer
- **Unicode Normalization:** NFC on ingest, reject mixed forms (planned; the parser currently consumes code points as-is)
- **Symbol Input:** ASCII escapes (\gamma → γ), exactly one per glyph; editor keymaps are future tooling
- **Semicolon handling:** `;` has one role — it separates expressions in a sequence; a trailing `;` is permitted (so `;` before `}` is legal but not required)
- **Comments:** `--` for single-line comments (to end of line), `{- ... -}` for multi-line comments (nestable)
- **String Literals:** 
  - Standard strings: `"..."` with escape sequences (`\n`, `\t`, `\\`, `\"`, `\u{XXXXXX}`)
  - Raw strings: `"""..."""` for multi-line, no escape processing
- **Path Literals:** Both `🖫"path"` and `\path"path"` supported for compatibility
- **Number Literals:** Decimal (`123`, `3.14`), hex (`0x1A`), binary (`0b1101`), with optional type suffixes later

### Operator Precedence Table

Authoritative copy: [precedence.csv](precedence.csv).

| Level | Operators | Associativity |
|-------|-----------|---------------|
| 11 | f(a, b) ‧ ⊕ ⊖ ↴{…} (postfix) | left |
| 10 | ↯ ✎ ⧈ ⏲ - ⇀_ch ↽_ch (prefix) | right |
| 9 | ∘ | left |
| 8 | × ÷ ∗ | left |
| 7 | + - | left |
| 6 | = ≠ < > ≤ ≥ ≈ ∼ | non-assoc |
| 5 | ∧ | left |
| 4 | ∨ | left |
| 3 | ⟹ | right |
| 2 | \| (guarded alternatives) | left |
| 1 | ← | right |
| 0 | ≜ | right |
| -1 | ‖ | left |
| -2 | ; | left |

### Grammar Resolutions
- **Block semantics:** Every expression in a sequence yields a value (ML-style)
- **Conditional associativity:** ⟹ is right-associative (a⟹b⟹c = a⟹(b⟹c)); guarded alternatives chain left: (c₁ ⟹ r₁) | (c₂ ⟹ r₂) | fallback
- **Choice type parsing:** one BAR token; the `|` inside ⟨a|b⟩ is the guarded-alternative level of the inner expression
- **Brace disambiguation:** `{a: e, …}` record, `{a, b, …}` set (two or more elements), anything else (incl. `{}`, `{x}`) a block

### Type System Extensions
- **Effect polymorphism:** `map : (A→ᴱ B) → List A →ᴱ List B`
- **Linear resources:** Compile-time ⊕/⊖ tracking, 〔〕 = linear region sugar
- **Exception types:** `f : A →⟨E⟩ B` where E is union of raised types

### Concurrency Semantics
- **Memory model:** Happens-before with acquire/release on ⌈⌉
- **Parallel failure:** Fail-fast, cancel siblings, aggregate choice types
- **Deadlock detection:** Optional --debug-sync runtime verifier

### Module System
- **Naming:** `𝓜‧A‧B` in source → `A/B.mpl` on disk
- **Re-export:** `Vector ⇒ 𝓜‧LinearAlgebra‧Vector`
- **Versioning:** `𝓜 LinearAlgebra@1.2.0 ⇒ { ... }`

### Missing Syntax (M1 Requirements)

#### Pattern Matching
```
match expr with
| pattern₁ ⟹ expr₁
| pattern₂ ⟹ expr₂
end

pattern ::= _ | literal | variable
          | ⟨Left pattern⟩ | ⟨Right pattern⟩    // choice
          | {field₁ = pattern₁, …}              // records
          | (pattern₁, pattern₂, …)             // tuples
```

#### Parametric Types
```
type_abs ::= ΛT. expr     // type lambda
type_app ::= expr [T]     // application

map ≜ ΛA. ΛB. λf: A→ᴱ B. λxs: List A. …
```

#### Foreign Function Interface
```
𝓜 Crypto@0.1.0 uses "libcrypto.so" {
    foreign digest      : 🖫Path →⟨IOErr⟩ Digest
    foreign randomBytes : ℕ → Bytes
}
```

### Static Semantics Rules

#### Region Typing
```
Γ ⊢ e₁ : Resource r          Γ, h:r ⊢ e₂ : α
───────────────────────────────────────────────   (REGION)
Γ ⊢ 〔 x ← e₁ ; e₂ ; x ⊖ 〕 : α
```

#### Exception Handling
```
Γ ⊢ e₁ : α             Γ ⊢ e₂ : β           Γ ⊢ e₃ : β
─────────────────────────────────────────────────────────  (HANDLE)
Γ ⊢ e₁ ↴ { ↯x ⟹ e₂ } : β  ▷  Eff = (Eff(e₁) - {Raise ε}) ∪ Eff(e₂)
```

### M0 Exit Criteria (all CI-enforced)
1. Grammar compiles with zero ANTLR errors and zero warnings (`-Werror`)
2. All ten example programs parse (`./gradlew parseExamples`)
3. Every ```mpl code block in the documentation parses (`DocumentationTest`)
4. Full test suite passes (`./gradlew test`)

Deferred to later milestones: pretty-print round-tripping and parser fuzzing.

## Implementation Roadmap
1. **M0:** ANTLR grammar + 500 LOC test suite
2. **M1:** Hindley-Milner + row effects + linearity checker
3. **M2:** Stack VM with green threads + deterministic GC
4. **M3:** Self-hosting (stdlib + compiler in MPL)
5. **M4:** LLVM backend with vectorized math ops
6. **M5:** Package manager (fetch/build/run workflow)

This specification provides a complete foundation for implementing a mathematical programming language that maintains cognitive universality while supporting all modern programming paradigms.