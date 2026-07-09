# MPL Architecture

This document describes the high-level architecture of the Mathematical Programming Language (MPL) implementation.

**Status**: only the lexing and parsing layers exist today (see the README's
project status). Everything from semantic analysis down — and the runtime,
error-message, performance and security sections below — describes the
*target* architecture, not shipped code.

## Overview

MPL is designed as a multi-layer system that transforms mathematical notation into executable code:

```
┌─────────────────────────────────────────────────────┐
│                   User Input                        │
│  (Unicode Symbols / ASCII Escapes / Voice / Visual) │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────┐
│               Input Processing Layer                │
│  • Unicode Normalization (NFC)                     │
│  • Bidirectional Text Support                      │
│  • ASCII Escape Expansion                          │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────┐
│                  Lexical Analysis                   │
│  • ANTLR 4 Lexer (MPL.g4)                         │
│  • Token Stream Generation                         │
│  • Symbol Recognition                              │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────┐
│                 Syntactic Analysis                  │
│  • ANTLR 4 Parser (MPL.g4)                        │
│  • Precedence Resolution                           │
│  • AST Construction                                │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────┐
│                 Semantic Analysis                   │
│  • Type Inference                                  │
│  • Effect Analysis                                 │
│  • Symbol Resolution                               │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────┐
│                   Optimization                      │
│  • Constant Folding                                │
│  • Dead Code Elimination                           │
│  • Parallelism Detection                           │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────┐
│                 Code Generation                     │
│  • Target Platform Selection                       │
│  • Bytecode / Native Code Generation               │
│  • Runtime Library Linking                         │
└─────────────────────────────────────────────────────┘
```

## Core Components

### 1. Grammar Definition (`src/main/antlr4/MPL.g4`)

The heart of MPL is its ANTLR 4 grammar that defines:
- **Mathematical Operators**: every glyph with exactly one meaning and one ASCII escape ([glyph-escapes.md](../glyph-escapes.md))
- **Effect Operators**: Exception handling (↯/↴), concurrency (‖), resources (⊕/⊖)
- **Precedence Rules**: a documented chain ([precedence.csv](../precedence.csv))
- **CI-clean**: compiles with zero ANTLR errors and warnings (`-Werror`)

Key grammar rules (excerpted from the real grammar):
```antlr
// Definition and assignment levels of the precedence chain
defExpr    : assignExpr (DEFINITION defExpr)? ;      // x ≜ e
assignExpr : condExpr (LEFTARROW assignExpr)? ;      // x ← e

// Guarded alternatives: (condition ⟹ result) | fallback
condExpr   : impliesExpr (BAR impliesExpr)* ;

// λx: body, λx,y: body, λx∈ℝ: body
lambda     : LAMBDA_VAR pattern (IN condExpr)? COLON expr ;
```

### 2. Symbol System

MPL uses a three-tier symbol system:

1. **Unicode Symbols** (Primary)
   - Direct mathematical notation: ∀, λ, ∈, ⟹
   - Effect operators: ↯, ↴, ‖, ⇀, ↽
   - Type symbols: ℕ, ℤ, ℚ, ℝ, ℂ, 𝔹

2. **ASCII Escapes** (Fallback)
   - Every symbol has exactly one escape: `\forall`, `\lambda`, …
   - Defined in `glyph-escapes.md` (kept in lockstep with the lexer)

3. **Multi-Modal Input** (Future)
   - Voice recognition for mathematical terms
   - Visual palette selection
   - Handwriting recognition

### 3. Type System (planned, M1)

MPL features a hybrid type system:

```
Types := BaseType | FunctionType | CollectionType | EffectType

BaseType := ℕ | ℤ | ℚ | ℝ | ℂ | 𝔹 | String | Unit
FunctionType := Type → Type
CollectionType := [Type] | {Type} | (Type₁, Type₂, ...)
EffectType := Type ! {Exception, IO, Concurrent, Resource}
```

Type inference follows Hindley-Milner with extensions for:
- Numeric type promotion
- Effect tracking
- Parallel composition

### 4. Effect System

MPL tracks computational effects at the type level:

| Effect | Symbol | Purpose |
|--------|--------|---------|
| Exception | ↯/↴ | Throwing and catching errors |
| Concurrency | ‖ | Parallel execution |
| Channels | ⇀/↽ | Message passing |
| Resources | ⊕/⊖ | Acquisition/release |
| Atomicity | ⌈⌉ | Atomic sections |
| Metaprogramming | ⌜⌝/⌞⌟ | Code quotation/evaluation |

### 5. Parser Implementation

The parser is built using ANTLR 4 with Java:

```java
// Parser initialization
MPLLexer lexer = new MPLLexer(CharStreams.fromString(input));
MPLParser parser = new MPLParser(new CommonTokenStream(lexer));

// Parse with error handling
parser.addErrorListener(new MPLErrorListener());
ParseTree tree = parser.program();

// Visit AST
MPLVisitor visitor = new MPLASTBuilder();
AST ast = visitor.visit(tree);
```

### 6. Runtime Architecture (planned)

The MPL runtime provides:

1. **Memory Management**
   - Automatic reference counting
   - Resource scope tracking (RAII)
   - Parallel GC for concurrent code

2. **Concurrency Runtime**
   - Green threads for ‖ operator
   - Channel implementation for ⇀/↽
   - STM for atomic sections ⌈⌉

3. **Standard Library**
   - Mathematical functions
   - I/O operations
   - Collection manipulation
   - Network primitives

## Compilation Pipeline

### Phase 1: Lexical Analysis
1. Unicode normalization (NFC)
2. Symbol recognition
3. ASCII escape expansion
4. Token stream generation

### Phase 2: Parsing
1. Grammar rule matching
2. Precedence resolution
3. AST construction
4. Syntax error recovery

### Phase 3: Semantic Analysis (planned)
1. Symbol table construction
2. Type inference
3. Effect analysis
4. Semantic error checking

### Phase 4: Optimization (planned)
1. Constant folding
2. Common subexpression elimination
3. Parallelism detection
4. Effect optimization

### Phase 5: Code Generation (planned)
Options for different targets:
- **JVM Bytecode**: For Java interoperability
- **LLVM IR**: For native compilation
- **JavaScript**: For web execution
- **Python**: For educational use

## Error Handling (planned)

Today the parser emits standard ANTLR diagnostics. The goal is comprehensive error messages with:
1. **Unicode-aware positioning**: Correct column numbers for multi-byte characters
2. **Multi-language messages**: Errors in user's native language
3. **Visual error display**: Highlighting problematic symbols
4. **Suggestion system**: Common fixes for typical mistakes

Envisioned example error:
```
Error at line 3, column 12:
  (x > 0 ⟹ x | -x
             ^
  Syntax error: missing ')' before '|'
  Guarded alternatives read: (condition ⟹ result) | fallback
```

## Performance Considerations (planned)

1. **Parser Performance**
   - O(n) parsing for most constructs
   - Memoization for complex expressions
   - Incremental parsing support

2. **Unicode Handling**
   - Zero-copy string processing
   - Efficient symbol lookup tables
   - Caching for escape conversions

3. **Parallel Execution**
   - Work-stealing for ‖ operator
   - Lock-free channel implementation
   - NUMA-aware memory allocation

## Extension Points

The architecture supports extensions via:

1. **Grammar Extensions**: New operators in MPL.g4
2. **Type Extensions**: Custom type definitions
3. **Effect Extensions**: New computational effects
4. **Backend Extensions**: Additional compilation targets

## Security Considerations (planned)

1. **Input Validation**
   - Unicode homograph detection
   - Bidirectional text sanitization
   - Resource limit enforcement

2. **Sandboxing**
   - Capability-based security for I/O
   - Memory limits for student code
   - Time limits for execution

3. **Effect Isolation**
   - Effect types prevent unauthorized operations
   - Resource tracking prevents leaks
   - Concurrency limits prevent DoS

## Future Architecture Goals

1. **Language Server Protocol (LSP)**
   - Real-time error checking
   - Symbol completion
   - Refactoring support

2. **REPL Implementation**
   - Interactive development
   - Notebook integration
   - Visualization support

3. **Distributed Execution**
   - Cluster support for ‖
   - Distributed channels
   - Fault tolerance

---

This architecture enables MPL to achieve its goal of cognitive universality while maintaining performance and safety suitable for educational environments.