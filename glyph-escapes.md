# MPL Glyph Escape Sequences

This document is the authoritative mapping between ASCII escape sequences and
UTF-8 glyphs for the Mathematical Programming Language (MPL). It matches the
lexer rules in [`src/main/antlr4/MPL.g4`](src/main/antlr4/MPL.g4) exactly:
every escape below is accepted by the lexer, and no other escapes exist.

Each glyph has **exactly one** ASCII escape (One Right Answer). Symbols that
are plain ASCII (`; = < > + - ( ) [ ] { } : , _ | /` and the keywords
`true`/`false`) need no escape and have none.

## Greek Letters (Variables)

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\alpha` | U+03B1 | α | Variable |
| `\beta` | U+03B2 | β | Variable |
| `\gamma` | U+03B3 | γ | Variable |
| `\delta` | U+03B4 | δ | Variable |
| `\epsilon` | U+03B5 | ε | Variable |
| `\zeta` | U+03B6 | ζ | Variable |
| `\eta` | U+03B7 | η | Variable |
| `\theta` | U+03B8 | θ | Variable |
| `\iota` | U+03B9 | ι | Variable |
| `\kappa` | U+03BA | κ | Variable |
| `\lambda` | U+03BB | λ | Lambda / variable |
| `\mu` | U+03BC | μ | Variable |
| `\nu` | U+03BD | ν | Variable |
| `\xi` | U+03BE | ξ | Variable |
| `\omicron` | U+03BF | ο | Variable |
| `\pi` | U+03C0 | π | Variable |
| `\rho` | U+03C1 | ρ | Variable |
| `\sigma` | U+03C3 | σ | Variable |
| `\tau` | U+03C4 | τ | Variable |
| `\upsilon` | U+03C5 | υ | Variable |
| `\phi` | U+03C6 | φ | Variable |
| `\chi` | U+03C7 | χ | Variable |
| `\psi` | U+03C8 | ψ | Variable |
| `\omega` | U+03C9 | ω | Variable |

## Type Symbols

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\nat` | U+2115 | ℕ | Natural numbers |
| `\int` | U+2124 | ℤ | Integers |
| `\rat` | U+211A | ℚ | Rational numbers |
| `\real` | U+211D | ℝ | Real numbers |
| `\complex` | U+2102 | ℂ | Complex numbers |
| `\bool` | U+1D539 | 𝔹 | Booleans |
| `\bot` | U+22A5 | ⊥ | Bottom |

## Logic and Sets

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\in` | U+2208 | ∈ | Element of |
| `\emptyset` | U+2205 | ∅ | Empty set |
| `\and` | U+2227 | ∧ | Logical and |
| `\or` | U+2228 | ∨ | Logical or |
| `\implies` | U+27F9 | ⟹ | Implication / guard arrow |
| `\forall` | U+2200 | ∀ | Universal quantifier (iteration) |

## Operations

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\times` | U+00D7 | × | Multiplication |
| `\div` | U+00F7 | ÷ | Division (`/` is an ASCII alias) |
| `\ast` | U+2217 | ∗ | Generic operator |
| `\circ` | U+2218 | ∘ | Function composition |

## Relations

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\neq` | U+2260 | ≠ | Not equal |
| `\leq` | U+2264 | ≤ | Less than or equal |
| `\geq` | U+2265 | ≥ | Greater than or equal |
| `\approx` | U+2248 | ≈ | Approximately equal |
| `\sim` | U+223C | ∼ | Similar to |

## Definition and Assignment

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\leftarrow` | U+2190 | ← | Assignment |
| `\coloneq` | U+225C | ≜ | Definition |

## Effect Operators

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\raise` | U+21AF | ↯ | Raise exception |
| `\handle` | U+21B4 | ↴ | Handle exception (postfix) |
| `\parallel` | U+2016 | ‖ | Parallel composition |
| `\lceil` | U+2308 | ⌈ | Atomic section start |
| `\rceil` | U+2309 | ⌉ | Atomic section end |
| `\oplus` | U+2295 | ⊕ | Allocate resource (postfix) |
| `\ominus` | U+2296 | ⊖ | Release resource (postfix) |
| `\send` | U+21C0 | ⇀ | Send to channel: `⇀_ch expr` |
| `\receive` | U+21BD | ↽ | Receive from channel: `↽_ch expr` |
| `\trace` | U+270E | ✎ | Output / trace |
| `\break` | U+29C8 | ⧈ | Breakpoint |
| `\delay` | U+23F2 | ⏲ | Delay |
| `\periodic` | U+27F3 | ⟳ | Periodic task |

## Modules and Metaprogramming

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\module` | U+1D4DC | 𝓜 | Module declaration |
| `\Rightarrow` | U+21D2 | ⇒ | Export (module body follows) |
| `\middot` | U+2027 | ‧ | Qualified module access |
| `\path` | U+1F5AB | 🖫 | File path prefix |
| `\ulcorner` | U+231C | ⌜ | Code quotation start |
| `\urcorner` | U+231D | ⌝ | Code quotation end |
| `\llcorner` | U+231E | ⌞ | Code evaluation start |
| `\lrcorner` | U+231F | ⌟ | Code evaluation end |
| `\lbracket` | U+3014 | 〔 | RAII scope start |
| `\rbracket` | U+3015 | 〕 | RAII scope end |
| `\langle` | U+27E8 | ⟨ | Choice type start |
| `\rangle` | U+27E9 | ⟩ | Choice type end |

## String Escape Sequences

String literals in MPL support the following escape sequences within
double-quoted strings:

| Escape Sequence | Character | Description |
|----------------|-----------|-------------|
| `\\` | `\` | Backslash |
| `\"` | `"` | Double quote |
| `\n` | LF | Line feed (newline) |
| `\r` | CR | Carriage return |
| `\t` | TAB | Horizontal tab |
| `\0` | NUL | Null character |
| `\u{XXXXXX}` | Unicode | Unicode code point (1-6 hex digits) |

Examples:
- `"Hello\nWorld"` - String with newline
- `"Path: \"C:\\Users\""` - Escaped quotes and backslashes
- `"Unicode: \u{1F600}"` - Unicode emoji 😀
- `"""Raw string - no \n escapes"""` - Raw multi-line string

## Deferred to M1

The following glyphs appeared in earlier drafts but are **not** part of the
M0 grammar. Each returns only together with a defined semantic:

∪ ∩ ⊂ ⊃ ⊆ ⊇ ∉ ¬ ⟺ ∃ ⇐ → ⇡ ⇣ ⇆ ⟪ ⟫ ∑ √ ² `?` `%`

## Usage Notes

1. **Input methods:**
   - Direct Unicode input (recommended for supported editors)
   - ASCII escape sequences (for compatibility, work in any editor)

2. **Lexer behavior:**
   - Escapes are alternatives in the lexer rules, processed during tokenization
   - Unknown escapes are a lexical error
   - Mixed Unicode/ASCII in the same file is allowed
