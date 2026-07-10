# Mathematical Programming Language (MPL) 🌍
**Breaking the last language barrier in technology**

<div align="center">

![Status](https://img.shields.io/badge/status-proof--of--concept-orange)
![Parser](https://img.shields.io/badge/parser-M0-brightgreen)
![Execution](https://img.shields.io/badge/M0%20core-runs-brightgreen)
![License](https://img.shields.io/badge/license-AGPLv3-blue)

**∀ child ∈ world : canCode(child)**

[🎓 For Educators](#for-educators) | [💻 For Developers](#for-developers) | [🌍 For Humanity](#for-humanity)

</div>

---

## 🚨 Project Status: Proof of Concept

**The M0 core runs — with ratified semantics.** This repository contains the grammar, the parser, and the browser interpreter (`js/mpl.js`) that runs the M0 core today at [mpl.codes](https://mpl.codes). Its semantics are not folklore: every judgment call is recorded and ruled in [conformance/JUDGMENT_CALLS.md](conformance/JUDGMENT_CALLS.md), pinned by **89 ratified conformance tests** that gate CI, and a differential fuzzer holds the interpreter and the grammar to zero divergence. A native runtime beyond the browser core does not exist yet — building it is the next milestone, and contributors are welcome.

### What Works Today ✅

Every item below is enforced by [CI](.github/workflows/ci.yml) on every push:

- An ANTLR 4 grammar built from mathematical symbols that compiles with zero errors and zero warnings (warnings are treated as errors)
- All 10 [example programs](examples/) parse (`./gradlew parseExamples`)
- A test suite covering the lexer, the parser, the examples, and every ```` ```mpl ```` code block in this README (`./gradlew test`)
- An ASCII escape sequence for every Unicode symbol ([glyph-escapes.md](glyph-escapes.md))
- The M0 core executes with ratified semantics: 89 ratified conformance tests (`node conformance/harness/run.mjs --ratified`), exact rational arithmetic, and a recorded ruling for every semantic question ([conformance/JUDGMENT_CALLS.md](conformance/JUDGMENT_CALLS.md))

### What Doesn't Work Yet 🚧
- **No native runtime** - The M0 core runs in the browser interpreter (`js/mpl.js`); everything beyond it parses but does not run yet
- **No type checking** - Types are recognized but not validated
- **No standard library** - No built-in functions
- **No tooling** - Basic parser only

## Vision: Programming Without Language Barriers

In a world where 80% of humanity doesn't speak English, why should programming—the literacy of the 21st century—require it? MPL demonstrates that we can build programming languages using mathematical symbols that children already understand, making computational thinking accessible to billions previously excluded by language barriers.

**This is cognitive justice in action.**

---

## 🎯 The Fatima test


> "Why do I need to know English to write a program?" — Fatima, 10 years old, Cairo

Every design decision in MPL must pass one simple test: **Can a 10-year-old non-English speaker understand this?**

### Traditional programming
```python
# English required:
for n in [1, 2, 3, 4, 5]:
    print(n * n)
```

### MPL - Universal understanding
```mpl
-- Mathematical symbols only:
∀ n ∈ [1, 2, 3, 4, 5] : ✎(n × n)
```

If Fatima can't understand it with her basic math knowledge, we redesign it. No exceptions.

---

## 🚀 Quick start journey

<div align="center">

### Choose your path

| 🎓 **Educator?** | 💻 **Developer?** | 🌍 **Changemaker?** |
|:---:|:---:|:---:|
| [See the Vision](#educational-vision) | [Technical Details](#technical-architecture) | [Why This Matters](#why-this-matters) |
| Imagine teaching without English | Help build the runtime | Support cognitive justice |

</div>

### Hello, world in 30 seconds

<table>
<tr>
<th>Traditional (English Required)</th>
<th>MPL (Universal)</th>
</tr>
<tr>
<td>

```python
print("Hello, World!")
```

</td>
<td>

```mpl
✎"Hello, World!"
```

</td>
</tr>
<tr>
<td>English words: print</td>
<td>Universal symbol: ✎ (output/trace)</td>
</tr>
</table>

**Note**: This syntax is valid and parses. The M0 core runs in the browser interpreter at [mpl.codes](https://mpl.codes); features beyond the M0 core parse but do not run yet.

---

## 🔮 How it works

### For everyone
Write code using mathematical symbols instead of English words. It's that simple.

```
┌─────────────────────────────────────────────┐
│          Mathematical Notation              │
│    λn: (n ≤ 1 ⟹ 1) | (n × fact(n-1))       │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│           Unicode Input                     │
│    (Visual palette, voice, keyboard)        │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│          ANTLR 4 Parser                     │
│         Lexer → Parser → AST                │
└─────────────────────────────────────────────┘
```

### Five ways to write λ (lambda)

Today the parser accepts two spellings of every symbol: the Unicode glyph (λ) and its ASCII escape (`\lambda`). The rest are the input methods we envision tooling for:

1. **⌨️ Type** — `\lambda` (works today, in any editor)
2. **👆 Click** — Visual symbol palette (envisioned)
3. **🎤 Speak** — "Lambda" in ANY language (envisioned)
4. **✍️ Draw** — Handwriting recognition on tablets (envisioned)
5. **⚡ Shortcut** — Platform shortcuts (envisioned)

<details>
<summary>🔧 Technical details (click to expand)</summary>

### Unicode implementation
- Full Unicode support, including supplementary-plane symbols (𝓜, 𝔹, 🖫)
- Every glyph has exactly one ASCII escape ([glyph-escapes.md](glyph-escapes.md))

### Parser architecture
```
Input Methods → Unicode Stream → ANTLR 4 Lexer → Parse Tree
```
Type checking, optimization and code generation are planned, not built.

### Grammar specification
- Compiles with zero ANTLR errors and warnings (enforced in CI)
- Operator precedence documented in [precedence.csv](precedence.csv)
- [View full ANTLR grammar](src/main/antlr4/MPL.g4)

</details>

---

## ✨ Core features

### 🌐 Cognitive universality
**Mathematical symbols as humanity's common language**

- **No translation needed** — Math is already universal
- **Cultural neutrality** — No linguistic imperialism
- **Instant comprehension** — Symbols map to concepts directly

### 🎨 Multi-modal input (envisioned)
**Meet learners where they are**

Only ASCII escapes exist today; the rest is the tooling we want to build:

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Visual    │    Voice    │  Keyboard   │ Handwriting │
│   Palette   │    Input    │   Escapes   │ Recognition │
├─────────────┼─────────────┼─────────────┼─────────────┤
│  Click λ    │ Say "lambda"│ Type \lambda│  Draw λ     │
│  from menu  │ in any lang │ (works now) │  on screen  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

- **ASCII escapes** — `\lambda`, `\forall`, … work in any editor today
- **Visual palette** — Click symbols like emoji (envisioned)
- **Voice input** — Speak in your native language (envisioned)
- **Handwriting** — Natural for mathematical notation (envisioned)

### 📈 Progressive complexity
**From arithmetic to algorithms**

```mpl
-- Level 1: Basic math (everyone knows this!)
x ≜ 5 + 3;
y ≜ x × 2;

-- Level 2: Logic (learned in school)
x > 10 ∧ y < 20 ⟹ ✎"Success!";

-- Level 3: Advanced (natural progression)
squares ≜ 0;
∀ n ∈ [1, 2, 3, 4, 5] : squares ← squares + n × n;
```

---

## 📊 Educational Vision

### The Problem We're Solving

Consider a hypothetical student, "Maria" from São Paulo:
- She loves math and logic puzzles
- She wants to learn programming
- But she must first memorize English keywords like `for`, `while`, `if`, `else`
- The Portuguese word "for" means "went" - adding confusion
- She spends more time translating than learning computational thinking

### What MPL Could Enable (Vision, Not Reality)

With MPL fully implemented, we envision students could:
- Write their first program in minutes using familiar mathematical symbols
- Focus on logic and problem-solving, not foreign vocabulary
- Learn alongside parents who also don't speak English
- Build confidence through immediate understanding

### Hypothetical Benefits We Aim For

If MPL were fully implemented and deployed in classrooms, we hypothesize it could achieve:

| Potential Metric | Traditional Approach | MPL Vision |
|-----------------|---------------------|------------|
| Time to understand loops | Days of memorizing `for` | Minutes with ∀ symbol |
| Cognitive load | High (translate + learn) | Lower (direct understanding) |
| Parent involvement | Limited by English | Possible with math symbols |

**Note: These are aspirational goals based on our hypothesis, not measured results.**

### Envisioned Success Stories

These are hypothetical scenarios we hope MPL could enable once fully implemented:

<details>
<summary>🌍 Imagine: A student's potential journey</summary>

We envision students could progress like this:

**Starting point**: Basic math knowledge, no English
```mpl
-- Month 1: First program using familiar symbols
✎"Jambo!"  -- Hello in their language
```

**Growing skills**: Applying math knowledge to programming
```mpl
-- Month 6: Using mathematical concepts they know
data ≜ [23, 45, 67, 34, 89, 12];
total ≜ 0;
∀ x ∈ data : total ← total + x;
average ≜ total ÷ 6;
✎("Average: " + average)
```

**Sharing knowledge**: Teaching others in their community

*This is our vision - not current reality. Help us make it possible!*

</details>

---

## 💻 Code examples (Syntax Demonstration)

**Note**: These examples show valid MPL syntax that our parser accepts (a test extracts every code block on this page and parses it). The M0-core subset runs in the browser interpreter at [mpl.codes](https://mpl.codes); the rest parses but does not run yet.

Some notation you might expect from math class — ∑, √, ², `%` (modulo), |x|, ranges like [1..10] — is deliberately absent: it is deferred to milestone M1, where each symbol will arrive together with defined semantics (see [DECISIONS.md](DECISIONS.md)).

### Level 1: Arithmetic thinking 🔢
*What every child knows*

```mpl
-- Store values (like math class!)
length ≜ 5;
width ≜ 3;
area ≜ length × width;
✎("Area = " + area);

-- Make decisions: (condition ⟹ result) | fallback
age ≜ 15;
(age ≥ 18 ⟹ ✎"Adult") | ✎"Minor";
```

### Level 2: Logical reasoning 🧩
*Natural progression from math*

```mpl
-- Do something for every element (∀ = "for all")
∀ n ∈ [1, 2, 3, 4, 5] : ✎(n × n);

-- Accumulate a running total
total ≜ 0;
∀ n ∈ [1, 2, 3, 4, 5] : total ← total + n;
✎("Total: " + total);
```

### Level 3: Real-world applications 🌍
*Solving community problems*

```mpl
-- Weather data analysis
temperatures ≜ [28, 30, 27, 31, 29, 33, 28];
total ≜ 0;
∀ t ∈ temperatures : total ← total + t;
μ ≜ total ÷ 7;
✎("Average: " + μ + "°C");

-- Parallel processing (‖ = parallel)
results ≜ analyzeNorth() ‖ analyzeSouth() ‖ analyzeEast();
```

### Level 4: Advanced concepts 🚀
*For those ready to go deeper*

```mpl
-- Function composition (∘, straight from math class)
double ≜ λn: n × 2;
addOne ≜ λn: n + 1;
transform ≜ double ∘ addOne;
✎(transform(5));

-- Higher-order functions
apply ≜ λf, x: f(x);
✎(apply(λn: n × n, 6));
```

---

## Why Release a Parser Without Execution?

We believe the core innovation of MPL is proving that mathematical notation can replace English keywords. By releasing the parser, we demonstrate this is grammatically possible and invite the community to help build the rest.

The parser alone proves several key points:
- Mathematical symbols can express the core programming constructs (see the ten [examples](examples/))
- A language without English keywords is technically feasible
- The grammar compiles with zero ANTLR errors and warnings, enforced in CI
- ASCII fallbacks make it universally typeable

Sometimes the idea is more important than the implementation. By sharing MPL now, we hope to inspire others to think differently about programming languages and who they exclude.

---

## 🏗️ Technical architecture

### Grammar specification

- Every symbol has exactly one meaning and one ASCII escape ([glyph-escapes.md](glyph-escapes.md))
- Operator precedence is documented in [precedence.csv](precedence.csv) and exercised by the test suite
- The grammar compiles with zero ANTLR errors and warnings (`-Werror`, enforced in CI)
- 200+ syntax assertions across the lexer, parser, example, and documentation test suites
- [Full grammar specification](src/main/antlr4/MPL.g4)

### Implementation stack

```
┌─────────────────────────────────────────────┐
│          Input Layer (Multi-modal)          │
│  Visual │ Voice │ Keyboard │ Handwriting   │
└────┬────┴───┬───┴────┬────┴───────┬────────┘
     │        │        │            │
┌────▼────────▼────────▼────────────▼────────┐
│            Unicode Normalization            │
│         (UTF-8 with BiDi support)          │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│            ANTLR 4 Parser                  │
│    Lexer → Parser → AST Generation         │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│          Semantic Analysis (planned)        │
│    Type Checking → Effect Analysis         │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│          Code Generation (planned)          │
│   LLVM │ JVM │ JavaScript │ Python         │
└────────────────────────────────────────────┘
```

Only the parser stage exists today; the lower stages are the planned architecture. We publish no performance numbers until CI measures them.

---

## 🗺️ Pilot program roadmap

### Phase 1: Foundation 🏗️ (Months 1-3) ✅
- [x] Core parser implementation
- [x] Basic syntax examples
- [x] Grammar validation complete
- [ ] Educational materials in development

### Phase 2: Interpreter 📊 (Current Focus) **← We are here**
- [ ] Basic expression evaluation
- [ ] Control flow implementation
- [ ] Function calls
- [ ] Standard library basics

### Phase 3: Educational Materials 🚀 (Future)
- [ ] First pilot classroom test
- [ ] Basic curriculum development
- [ ] Teacher guide creation
- [ ] Community feedback integration

### Phase 4: Expansion 🌍 (Long-term Vision)
- [ ] Multi-school pilots
- [ ] Research partnerships
- [ ] Policy advocacy
- [ ] Global community building

---

## 🤝 Community & contribution

### For educators 🎓

<div align="center">

| Resource | Description | Get Started |
|----------|-------------|-------------|
| **Classroom Kit** | Future: Lesson plans and exercises | Coming soon |
| **Teacher Training** | Future: Online certification | Planned |
| **Community Forum** | Future: Educator community | In development |
| **Student Showcase** | Future: Project gallery | Under consideration |

</div>

### For developers 💻

```bash
# Clone and build
git clone https://github.com/developtheweb/mpl.git
cd mpl
./gradlew build

# Run tests
./gradlew test

# Parse examples (validation only, no execution)
./gradlew parseExamples
```

**Key contribution areas:**
- 🔤 Symbol input methods
- 🌍 Localization systems
- 📚 Educational content
- 🔧 Language features
- 📱 Mobile applications

[Contributing guidelines](CONTRIBUTING.md) | [Architecture docs](docs/ARCHITECTURE.md) | [GitHub issues](https://github.com/developtheweb/mpl/issues)

### For researchers 🔬

- **Cognitive load studies** — Measuring comprehension rates
- **Learning outcome analysis** — Long-term retention data
- **Cultural adaptation** — Symbol interpretation across cultures
- **Neurodiversity research** — Benefits for different learning styles

[Research collaboration](mailto:developtheweb@protonmail.com)

### For advocates 📢

**Help us reach more children:**
- 📄 Policy templates for education ministries - Coming soon
- 🎤 Speaker materials for conferences - In development
- 📊 Research findings - See [whitepaper](whitepaper/mpl-whitepaper.md)
- 🎨 Media kit - Coming soon

---

---

## 🌟 Why This Matters

### The Vision

Imagine a world where:
- A teacher in Beijing could explain loops using ∀ instead of `for`
- A parent in Mumbai could understand their child's code without knowing English
- Education ministers could provide programming education without requiring English literacy

These aren't testimonials - they're possibilities we're working toward. MPL is still just a parser, but it proves that programming without English is possible.

---

## 🎯 Join the movement

<div align="center">

### **Every child deserves to code in the language of their thoughts**

| 🎓 **Educators** | 💻 **Developers** | 🏛️ **Institutions** | 💰 **Supporters** |
|:---:|:---:|:---:|:---:|
| Share the vision | [Contribute code](https://github.com/developtheweb/mpl) | Contact us to explore | Star the project |
| Imagine the possibilities | Build the runtime | Research partnerships | Spread the word |

</div>

---

## 📚 Resources

<div align="center">

| 📖 [Documentation](docs/) | 🔬 [Whitepaper](whitepaper/mpl-whitepaper.md) | 📧 [Contact](mailto:developtheweb@protonmail.com) |
|:---:|:---:|:---:|
| View specs | Read the vision | Get in touch |

</div>

---

## 🚀 The inspiration

The idea for MPL came from a simple observation: children worldwide learn the same mathematical symbols (+, -, ×, ÷, =) but must learn English to program. This creates an unnecessary barrier.

Imagine a student asking: *"Why do I need to know English to tell a computer what to do? I know math. Isn't that enough?"*

This hypothetical question captures the essence of MPL. Mathematical thinking IS enough. We're building this proof of concept to demonstrate it's possible.

---

## 🔬 Cognitive science foundation

<details>
<summary>Why mathematical symbols work universally (click to expand)</summary>

### Symbolic universality

Mathematical notation evolved over millennia to be:
- **Culture-agnostic** — Symbols transcend linguistic boundaries
- **Cognitively efficient** — Direct concept-to-symbol mapping
- **Progressively learnable** — Builds on existing knowledge

### Neurological evidence

fMRI studies show mathematical symbol processing activates language-independent brain regions, enabling comprehension without linguistic translation.

### Pedagogical advantages

1. **Reduced cognitive load** — Single-step comprehension
2. **Transfer learning** — Math knowledge directly applies
3. **Cultural preservation** — Think in your native language
4. **Universal collaboration** — Code readable globally

[Read our whitepaper](whitepaper/mpl-whitepaper.md)

</details>

---

## 🌏 Global partnership vision

### Partnership Opportunities

We envision collaborating with organizations like:

<div align="center">

| Type of Partner | Potential Role | Envisioned Impact |
|-----------------|----------------|-------------------|
| **UN Agencies** | Education frameworks | Global policy influence |
| **Universities** | Research partnerships | Cognitive studies |
| **Tech Companies** | Technical support | Infrastructure development |
| **Local NGOs** | Community implementation | Grassroots adoption |

*Note: We are actively seeking our first institutional partners. Contact us if interested.*

</div>

### Join as a partner

We're seeking partnerships with:
- 🏫 **Schools & Universities** — Pilot programs
- 🏢 **Tech Companies** — Internships for MPL students
- 🏛️ **Governments** — National curriculum integration
- 🎓 **Research Institutions** — Impact studies
- 💡 **NGOs** — Community implementation

[Contact us](mailto:developtheweb@protonmail.com) to explore partnerships

---

## 🔮 Future roadmap

### Beyond programming

MPL is just the beginning. Our vision extends to:

1. **Mathematical Interfaces** — Operating systems using symbols
2. **Universal IDE** — Development environments without language barriers
3. **Symbolic Databases** — Query languages using set notation
4. **AI Training** — Teaching AI in mathematical notation
5. **Global Standard** — ISO standardization for universal programming

### The 2030 vision

By 2030, we envision a world where:
- ✅ **Any child** can learn programming in their native cognitive framework
- ✅ **No talent** is lost to language barriers
- ✅ **Global collaboration** happens without linguistic friction
- ✅ **Cognitive diversity** strengthens our collective problem-solving
- ✅ **Technology** truly serves all humanity

---

<div align="center">

## 🌟 A world where code speaks the language of human thought

### Not English. Not Chinese. Not Spanish.
### The language of logic itself.

**Together, we're not just teaching programming.**
**We're democratizing the power to create.**

---

*This is what we're building toward - a world where every child's way of thinking matters in programming.*

---

### [⭐ Star this repository](https://github.com/developtheweb/mpl) to support cognitive justice in programming

### **The next Fatima is waiting. Let's make sure nothing is lost in translation.**

</div>

---

<div align="center">

**Mathematical Programming Language** — Where every mind can code

[GitHub](https://github.com/developtheweb/mpl) • [Documentation](docs/) • [Contact](mailto:developtheweb@protonmail.com)

Made with ❤️ for the 80% of humanity waiting to code

</div>