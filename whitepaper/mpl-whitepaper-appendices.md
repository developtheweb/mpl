# Mathematical Programming Languages: Complete Appendices

## Appendix A: Complete Symbol Reference

The authoritative symbol table — every glyph, its single ASCII escape, and
its Unicode code point — is maintained in one place:
[`glyph-escapes.md`](../glyph-escapes.md). It matches the lexer rules in
[`MPL.g4`](../src/main/antlr4/MPL.g4) exactly. A duplicate table here would
drift; earlier versions of this appendix did exactly that.

In summary, the M0 symbol set comprises:

- **24 Greek letters** (α…ω) as variables, with λ doubling as the lambda binder
- **Logic**: ∧ ∨ ⟹ ∀
- **Arithmetic**: + - × ÷ (ASCII alias `/`) ∗ ∘, with unary minus
- **Comparisons**: = ≠ < > ≤ ≥ ≈ ∼
- **Sets and types**: ∅ ∈ ℕ ℤ ℚ ℝ ℂ 𝔹 ⊥
- **Definition and assignment**: ≜ and ←
- **Output**: ✎ (the one output operator)
- **Effects**: ↯ ↴ ‖ ⌈⌉ ⊕ ⊖ ⇀ ↽ ⏲ ⧈ ⟳ 〔〕
- **Modules and metaprogramming**: 𝓜 ⇒ ‧ 🖫 ⌜⌝ ⌞⌟ ⟨⟩

Symbols reserved for M1 (∪ ∩ ⊂ ⊆ ∉ ¬ ⟺ ∃ → ⇐ ∑ √ ² % ? and friends) are
listed at the end of `glyph-escapes.md`; they are not in the grammar.

## Appendix B: Annotated Example Programs

### B.1 Hypothetical Student Journey - Progressive Examples

#### Month 1: First Program
```mpl
✎ "Jambo!"
```
**Annotations:**
- `✎` (pencil): Output operator - intuitively "write this out"
- No semicolon needed for single expressions
- String literals use standard double quotes
- **Passes Fatima Test**: A child would see a pencil and know it means "write"

#### Month 3: Variables and Arithmetic
```mpl
-- Calculate rectangle area
L ← 5;         -- length
w ← 3;         -- width
A ← L × w;     -- area formula
✎ A            -- prints 15 (once MPL executes)
```
**Annotations:**
- `←` (left arrow): Assignment matches math notation
- Variables can be single letters or Greek symbols
- `×` for multiplication (not `*`)
- Comments use `--` (double dash)

#### Month 6: Loops and Summation
```mpl
-- Sum numbers 1 to 10
numbers ← [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
total ← 0;
∀ n ∈ numbers : total ← total + n;
✎("Sum: " + total)
```
**Annotations:**
- `∀` (for all): Universal quantifier for iteration
- `∈` (element of): Natural set membership
- `[1..10]`: Range notation
- String concatenation with `+`

#### Month 6: Conditional Logic
```mpl
-- Classify a number
x ← -5;
(x < 0 ⟹ ✎"Negative") |
(x = 0 ⟹ ✎"Zero") |
(x > 0 ⟹ ✎"Positive")
```
**Annotations:**
- `⟹` (implies): If-then as logical implication
- No explicit "if" keyword needed
- Conditions evaluated in order

#### Month 6: Recursion (Factorial)
```mpl
-- Factorial function
fact ≜ λn: (n ≤ 1 ⟹ 1) | (n × fact(n - 1));

✎ fact(5)  -- 120 (once MPL executes)
```
**Annotations:**
- `≜` (define as): Function definition
- `λ` (lambda): Function notation
- `∣` (pipe): Else separator in conditionals
- Recursion mirrors mathematical definition

### B.2 Advanced Examples

#### Quadratic Solver
The quadratic solver below is an M1+ design sketch — it uses ², √ and
subscripts, which are not yet in the grammar, so it is fenced as plain text:

```text
-- Solve ax² + bx + c = 0   (M1+ design sketch, not yet parseable)
quadratic ≜ λa,b,c:
    Δ ← b² - 4×a×c;
    (Δ < 0 ⟹ ✎"No real solutions") |
    (Δ = 0 ⟹ ✎("One solution: " + (-b÷(2×a)))) |
    (Δ > 0 ⟹ ✎("Two solutions: " + ((-b + √Δ) ÷ (2×a)) + ", " + ((-b - √Δ) ÷ (2×a))))
```

#### List Processing
Set comprehensions and `mod` are M1+ design sketches, so this block is
fenced as plain text:

```text
-- Filter and map   (M1+ design sketch, not yet parseable)
numbers ← [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
evens ← {n ∈ numbers | n mod 2 = 0};
squares ← {n² | n ∈ evens};
✎ squares
```

#### Error Handling
```mpl
-- Safe division with exceptions
safeDivide ≜ λx, y: (y = 0 ⟹ ↯"Division by zero!") | (x ÷ y);

-- Using with handler
result ← safeDivide(10, 0) ↴ {
    ↯"Division by zero!" ⟹ ✎"Error caught";
    ↯e ⟹ ↯e  -- Re-raise other errors
}
```

#### Concurrent Downloads
```mpl
-- Download multiple URLs in parallel
urls ← ["http://a.com", "http://b.com", "http://c.com"];

-- Launch parallel downloads, sending each result to the results channel
∀ url ∈ urls : ⇀_results fetch(url);

-- Collect results
∀ url ∈ urls : (
    data ← ↽_results url;
    ✎("Downloaded: " + size(data) + " bytes")
)
```

#### File Processing with RAII
```mpl
-- Process file with automatic cleanup
processFile ≜ λpath: 〔
    file ← open(path) ⊕;    -- Acquire
    lines ← readLines(file);

    ∀ line ∈ lines : (
        words ← split(line, " ");
        ✎("Word count: " + count(words))
    )

    {- file automatically released here -}
〕;
```

### B.3 Real-World Application Examples

#### Data Analysis
∑, √ and ² are M1, so the statistics sketch is fenced as plain text:

```text
-- Statistical analysis   (M1+ design sketch, not yet parseable)
analyze ≜ λdata:
    n ← |data|;
    μ ← (∑ x ∈ data: x) ÷ n;
    σ² ← (∑ x ∈ data: (x-μ)²) ÷ n;
    σ ← √σ²;
    ✎("n=" + n + ", μ=" + μ + ", σ=" + σ)
```

#### Simple Web Server
Record field access (`req.path`) is M1, so the HTTP-server sketch is
fenced as plain text:

```text
-- HTTP server   (M1+ design sketch, not yet parseable)
server ≜ λport: ∀ req ∈ listen(port): handleRequest(req) ‖ acceptNext();

handleRequest ≜ λreq:
    (req.path = "/" ⟹ respond(200, "<h1>Welcome!</h1>")) |
    (req.path = "/api/data" ⟹ respond(200, getData())) |
    respond(404, "Not found")
```

#### Machine Learning - Perceptron
∑, indexing and field access are M1, so the perceptron sketch is fenced
as plain text:

```text
-- Simple perceptron   (M1+ design sketch, not yet parseable)
perceptron ≜ λweights, bias:
    λinputs:
        z ← (∑ i ∈ [1..|inputs|]: weights[i] × inputs[i]) + bias;
        (z > 0 ⟹ 1) | 0   -- Step activation

train ≜ λp, inputs, target, α:
    output ← p(inputs);
    error ← target - output;
    ∀ i ∈ [1..|inputs|]: p.weights[i] ← p.weights[i] + α×error×inputs[i];
    p.bias ← p.bias + α×error
```

## Appendix C: Grammar Validation

### C.1 ANTLR 4 Grammar Validation

The authoritative grammar is [`MPL.g4`](../src/main/antlr4/MPL.g4). Instead
of quoting statistics that drift, CI enforces these properties on every push:

- The grammar compiles under ANTLR 4.13 with **warnings treated as errors**
  (`-Werror`), so left recursion, token shadowing and unreachable
  alternatives fail the build
- All ten example programs parse (`./gradlew parseExamples`)
- Every ```mpl code block in the documentation parses (`DocumentationTest`)
- Start symbol: `program`; target: Java

### C.2 Precedence Table

Authoritative copy: [`precedence.csv`](../precedence.csv).

| Level | Operators | Example | Parses As |
|-------|-----------|---------|-----------|
| 11 | `f(a,b)` `‧` `⊕` `⊖` `↴{…}` | `M‧f(x)⊕` | `((M‧f)(x))⊕` |
| 10 | `↯ ✎ ⧈ ⏲ -` (prefix), `⇀_ch ↽_ch` | `✎ -a` | `✎(-a)` |
| 9 | `∘` | `f ∘ g ∘ h` | `(f ∘ g) ∘ h` |
| 8 | `×,÷,∗` | `a × b ÷ c` | `(a × b) ÷ c` |
| 7 | `+,-` | `a + b - c` | `(a + b) - c` |
| 6 | `=,≠,<,>,≤,≥,≈,∼` | `a < b = c` | Error (non-assoc) |
| 5 | `∧` | `a ∧ b ∧ c` | `(a ∧ b) ∧ c` |
| 4 | `∨` | `a ∨ b ∨ c` | `(a ∨ b) ∨ c` |
| 3 | `⟹` | `a ⟹ b ⟹ c` | `a ⟹ (b ⟹ c)` |
| 2 | `\|` | `a ⟹ b \| c` | `(a ⟹ b) \| c` |
| 1 | `←` | `a ← b ← c` | `a ← (b ← c)` |
| 0 | `≜` | `f ≜ g ≜ h` | `f ≜ (g ≜ h)` |
| -1 | `‖` | `a ‖ b ‖ c` | `(a ‖ b) ‖ c` |
| -2 | `;` | `a; b; c` | `(a; b); c` |

### C.3 Disambiguation Rules

**Lambda vs Variable λ**
- Context: `λ` opens a lambda and is also a Greek variable
- Resolution: one token (`LAMBDA_VAR`); the parser decides by position
- Test: `λ ← λx: x;` parses (assign a lambda to the variable λ)

**Braces: record vs set vs block**
- `{a: e, …}` is a record, `{a, b, …}` (two or more elements) is a set,
  everything else — including `{}` and `{x}` — is a block
- A singleton set literal cannot be written in M0 (documented in
  DECISIONS.md)

**The bar `|`**
- One BAR token serves guarded alternatives; the `|` inside `⟨a|b⟩` is the
  guarded-alternative level of the inner expression

## Appendix D: Symbol Pedagogy Guide

### D.1 Teaching Core Symbols

#### Teaching λ (Lambda/Function)
**Physical Activity**: "Function Machine"
- Students form input/output pairs
- One student is the "lambda" transforming inputs
- Example: λx: x×2 - student doubles any number given

**Metaphor**: "Recipe with blanks"
- λ is like a recipe that says "take ___ and do something"
- Fill in the blank when you use it

**Progressive Introduction**:
1. Start with simple: `λx: x + 1`
2. Multiple parameters: `λx,y: x + y`
3. With conditions: `λn: (n > 0 ⟹ n) | 0`

#### Teaching ∀ (For All/Loops)
**Physical Activity**: "Everyone Does"
- "∀ student in class: stand up"
- Students understand "for each" naturally

**Mathematical Connection**:
- Connect to set notation they know
- ∀ x ∈ {1,2,3}: means "do for 1, then 2, then 3"

**Code Progression**:
1. Simple iteration: `∀ n ∈ [1, 2, 3, 4, 5] : ✎ n`
2. With accumulation: `∀ n ∈ list: sum ← sum + n`
3. Nested loops: `∀ i ∈ [1, 2, 3] : ∀ j ∈ [1, 2, 3] : ✎(i + j)`

#### Teaching ✎ (Output)
**Physical Activity**: "Pencil and Paper"
- Students literally write on paper when they see ✎
- Reinforces the connection

**No Translation Needed**:
- Universal symbol - pencil means write everywhere
- Students grasp immediately

### D.2 Symbol Introduction Sequence

**Week 1: Basic I/O**
- ✎ (output)
- ← (assignment)
- Basic arithmetic: +, -, ×, ÷

**Week 2: Variables and Types**
- Greek letters as variables
- Type symbols: ℕ, ℝ, 𝔹
- Comparisons: <, >, =, ≠

**Week 3: Control Flow**
- ⟹ (if-then)
- | (fallback: `(condition ⟹ result) | fallback`)
- Simple conditions

**Week 4: Loops**
- ∀ (for all)
- ∈ (element of)
- List literals: [1, 2, 3]

**Week 5: Functions**
- λ (lambda)
- ≜ (define)
- Function calls

**Week 6+: Advanced Concepts**
- Exceptions: ↯, ↴
- Concurrency: ‖
- Resources: ⊕, ⊖

## Appendix E: Implementation Details

### E.1 Unicode Normalization (planned)

Input should undergo Unicode normalization to NFC before lexing. This is
planned; the current parser consumes code points as-is:

```java
// Planned: ensure consistent handling
String normalize(String input) {
    return Normalizer.normalize(input, Normalizer.Form.NFC);
}
```

### E.2 Error Messages

Context-aware error reporting maintains symbol clarity:

```
Error at line 3:14: Expected '⟹' after condition
  x < 0 | "negative"
        ^
Hint: A guard needs an arrow: (x < 0 ⟹ "negative") | fallback.
```

(Illustrative; today the parser emits standard ANTLR diagnostics.)

### E.3 ASCII Escape Processing

Each glyph has exactly one ASCII escape, defined as a lexer alternative
(the full table is [`glyph-escapes.md`](../glyph-escapes.md)):

```antlr
LAMBDA_VAR : 'λ' | '\\lambda' ;
FORALL     : '∀' | '\\forall' ;
IMPLIES    : '⟹' | '\\implies' ;
```

## Appendix F: Input Method Documentation (envisioned)

Only the ASCII escapes exist today; everything else in this appendix is
tooling we want to build.

### F.1 Visual Palette

**Beginner-Friendly Symbol Picker**
- Organized by category (Math, Logic, I/O, etc.)
- Hover shows name and usage
- Recently used section
- Search by meaning ("output" finds ✎)

### F.2 Text Shortcuts

The lexer accepts exactly one escape per glyph (`\lambda`, `\forall`, …).
Editor-side auto-replace could additionally offer shorthand that expands to
the glyph before the code ever reaches the lexer:

- `\lam` → λ (editor expands; the lexer itself only accepts `\lambda`)
- `:=` → ≜ (definition)
- `!=` → ≠ (not equal)

### F.3 Voice Input

**Multilingual Support**:
- "lambda" (English) → λ
- "لامدا" (Arabic) → λ
- "लैम्ब्डा" (Hindi) → λ
- "拉姆达" (Chinese) → λ

**Context-Aware Recognition**:
- "for all" → ∀
- "sum" → Σ
- "element of" → ∈

### F.4 Handwriting Recognition

**Symbol Training**:
- System learns from user's writing style
- Common variations supported
- Quick correction gestures

### F.5 Platform-Specific Methods

**Windows**: 
- Alt+Numpad codes
- Windows emoji picker (Win+.)

**macOS**:
- Character Viewer
- Custom keyboard layouts

**Linux**:
- Compose key sequences
- IBus/FCITX input methods

**Mobile**:
- Custom keyboard app
- Symbol panels in IDEs

## Appendix G: Envisioned Pilot Program Materials

### G.1 Potential Lesson Plan Template

**Lesson 1: Hello World**
- Objective: Write first program
- Materials: Tablets/computers, symbol chart
- Activity: Each student writes greeting in their language
- Assessment: Program runs successfully

**Key Teaching Points**:
1. ✎ means "write/output"
2. Strings in quotes
3. Run button executes code
4. Celebrate first success!

### G.2 Envisioned Teacher Training Guide

**Day 1: MPL Philosophy**
- The Fatima Test
- Cognitive justice principles
- Symbol over keyword approach

**Day 2: Core Language**
- Basic symbols and operations
- Common patterns
- Hands-on coding

**Day 3: Pedagogy**
- Symbol introduction sequence
- Physical activities
- Common misconceptions

**Day 4: Classroom Management**
- Pair programming with MPL
- Managing limited devices
- Assessment strategies

### G.3 Potential Student Workbook Outline

**Chapter 1: My First Program**
- Understanding the design philosophy
- Writing with ✎
- Your turn: Hello in your language

**Chapter 2: Calculator Magic**
- Variables with ←
- Math symbols you know
- Build a calculator

**Chapter 3: Making Decisions**
- If-then with ⟹
- Comparing numbers
- Choose your adventure

**Chapter 4: Repeat After Me**
- Loops with ∀
- Patterns and sequences
- Draw with loops

### G.4 Proposed Assessment Rubrics

**First Program (Formative)**
- Program runs: ✓/✗
- Uses ✎ correctly: ✓/✗
- Shows creativity: ✓/✗

**Week 4 Project (Summative)**
- Novice: Uses basic I/O and arithmetic
- Developing: Includes variables and conditions
- Proficient: Uses loops effectively
- Advanced: Defines and uses functions

### G.5 Planned Community Resources

**Online Forums**
- Teacher discussion boards
- Student showcase gallery
- Symbol reference wiki
- Troubleshooting guides

**Offline Materials**
- Printable symbol charts
- Unplugged activities
- Parent information sheets
- Certificate templates

---

*These appendices provide comprehensive technical and pedagogical resources for implementing MPL. For the latest updates and community contributions, visit: https://github.com/developtheweb/mpl*