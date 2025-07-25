# Mathematical Programming Language (MPL)

## Core Symbol Set

### Mathematical Foundation (LaTeX)
- **Variables:** α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω
- **Collections:** ∅,∪,∩,⊂,⊃,∈,∉,⊆,⊇
- **Logic:** ∧,∨,¬,⟹,⟺,∀,∃
- **Operations:** +,-,×,÷,∗,∘
- **Relations:** =,≠,<,>,≤,≥,≈,∼
- **Functions:** f: A → B, λ
- **Assignment:** ←
- **Definition:** ≜
- **Structure:** (),[]，{},⟨⟩

### Effect Extensions (11 new glyphs)
- **↯** Raise exception
- **↴** Handle exception  
- **‖** Parallel composition
- **⌈⌉** Atomic section/lock
- **⊕** Allocate resource
- **⊖** Release resource
- **𝓜** Module declaration
- **⇐** Import
- **⇒** Export  
- **⇀** Send (network)
- **↽** Receive (network)

### Additional Operators
- **⟨v|e⟩** Choice type (value or error)
- **🖫** File path prefix
- **⇡⇣** Stream positioning
- **⇆** Atomic swap
- **⟪⟫** Deep update path
- **⌜⌝** Code quotation
- **⌞⌟** Code evaluation
- **?** Introspection
- **⧈** Breakpoint
- **✎** Trace/log
- **⏲** Delay
- **⟳** Periodic task
- **〔〕** RAII scope

## Grammar

### Basic Expressions
```
expr ::= variable | literal | operation | function_call | block

variable ::= α | β | γ | ... | ω
literal ::= number | string | path | list | set
operation ::= expr OP expr
function_call ::= f(expr, ...)
block ::= { statement; ... }
```

### Statements
```
assignment ::= variable ← expr
definition ::= variable ≜ expr  
conditional ::= condition ⟹ expr
iteration ::= ∀variable∈set: expr
parallel ::= expr ‖ expr
atomic ::= ⌈expr⌉_lock
exception ::= ↯expr | expr ↴ {↯e ⇒ handler}
```

### Types
```
basic_type ::= ℕ | ℤ | ℚ | ℝ | ℂ | 𝔹
function_type ::= domain → codomain
choice_type ::= ⟨type|type⟩
effect_type ::= type^effect
```

## Example Programs

### Hello World
```
✎"Hello, World!"
```

### Factorial
```
factorial ≜ λn∈ℕ: n≤1 ⟹ 1 | n×factorial(n-1)
result ← factorial(5)
✎result
```

### File Processing with Error Handling
```
processFile ≜ λpath: 🖫path ↴ {
    data ← readFile(path)
    result ← transform(data)
    writeFile(result, 🖫"output.txt")
    ⟨"success"|"failed"⟩
} ↴ {↯e ⇒ ⟨⊥|e⟩}
```

### Concurrent Download
```
downloadAll ≜ λurls: ∀url∈urls: (
    fetchData(url) ‖ processData(url)
) ⟹ mergeResults()
```

### Module Definition
```
𝓜 Mathematics ⇒ {
    π ≜ 3.14159...
    sin ≜ λx∈ℝ: ...
    cos ≜ λx∈ℝ: ...
}

angle ← π/4
result ← Mathematics‧sin(angle)
```

### Resource Management
```
databaseQuery ≜ λquery: 〔
    conn ← database ⊕
    ⌈
        result ← execute(conn, query)
        ✎"Query executed"
        result
    ⌉_db_lock
    conn ⊖
〕
```

### Metaprogramming
```
generateFunction ≜ λname: ⌜
    λx: x × 2
⌝

doubler ← ⌞generateFunction("doubler")⌟
result ← doubler(21)
```

### Real-time System
```
scheduler ≜ ⟳(
    tasks ← getPendingTasks()
    ∀task∈tasks: execute(task) ‖ monitor(task)
    , 100ms
)
```

### Network Server
```
server ≜ λport: 〔
    socket ← bind(port) ⊕
    ∀request: (
        data ← ↽_socket request
        response ← processRequest(data)
        ⇀_socket response
    ) ‖ handleNext()
    socket ⊖
〕
```

### Type-safe Database
```
User ≜ {name: String, age: ℕ∣age>0, email: String}
query ≜ λtable∈Database: ∀row∈table: validateUser(row) ↴ {
    ↯"Invalid user" ⟹ ⊥
}
```

## Critical Implementation Decisions

### Lexical Layer
- **Unicode Normalization:** NFC on ingest, reject mixed forms
- **Symbol Input:** Cross-platform keymap (Ctrl+Alt+g → γ) + ASCII escapes (\gamma → γ)
- **Semicolon handling:** Require explicit `;` everywhere except before `}`

### Operator Precedence Table
| Level | Operators | Associativity |
|-------|-----------|---------------|
| 9 | function application | left |
| 8 | ↯ ✎ ? ⧈ ⏲ (prefix) | right |
| 7 | ∘ | left |
| 6 | × ÷ ∗ | left |
| 5 | + - | left |
| 4 | = ≠ < > ≤ ≥ ≈ ∼ | non-assoc |
| 3 | ∧ | left |
| 2 | ∨ | left |
| 1 | ⟹ | right |
| 0 | ← | right |
| -1 | ‖ | left |
| -2 | ; | left |

### Grammar Resolutions
- **Block semantics:** Every statement returns value (ML-style)
- **Conditional associativity:** Right-associative (a⟹b⟹c = a⟹(b⟹c))
- **Choice type parsing:** Different tokens for |value vs |type contexts

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
Γ ⊢ e₁ ↴ { ↯x ⇒ e₂ } : β  ▷  Eff = (Eff(e₁) - {Raise ε}) ∪ Eff(e₂)
```

### M0 Exit Criteria
1. All spec examples parse and pretty-print round-trip
2. No shift/reduce conflicts in grammar
3. 10,000 random token sequences don't crash parser

## Implementation Roadmap
1. **M0:** ANTLR grammar + 500 LOC test suite
2. **M1:** Hindley-Milner + row effects + linearity checker
3. **M2:** Stack VM with green threads + deterministic GC
4. **M3:** Self-hosting (stdlib + compiler in MPL)
5. **M4:** LLVM backend with vectorized math ops
6. **M5:** Package manager (fetch/build/run workflow)

This specification provides a complete foundation for implementing a mathematical programming language that maintains cognitive universality while supporting all modern programming paradigms.