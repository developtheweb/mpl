# MPL Glyph Escape Sequences

This document provides the authoritative mapping between ASCII escape sequences and UTF-8 glyphs for the Mathematical Programming Language (MPL).

## Core Mathematical Symbols

### Greek Letters (Variables)
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
| `\lambda` or `\lam` | U+03BB | λ | Lambda/Function |
| `\mu` | U+03BC | μ | Variable |
| `\nu` | U+03BD | ν | Variable |
| `\xi` | U+03BE | ξ | Variable |
| `\omicron` | U+03BF | ο | Variable |
| `\pi` | U+03C0 | π | Variable/Constant |
| `\rho` | U+03C1 | ρ | Variable |
| `\sigma` | U+03C3 | σ | Variable |
| `\tau` | U+03C4 | τ | Variable |
| `\upsilon` | U+03C5 | υ | Variable |
| `\phi` | U+03C6 | φ | Variable |
| `\chi` | U+03C7 | χ | Variable |
| `\psi` | U+03C8 | ψ | Variable |
| `\omega` | U+03C9 | ω | Variable |

### Set Theory
| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\emptyset` | U+2205 | ∅ | Empty set |
| `\union` or `\cup` | U+222A | ∪ | Set union |
| `\intersect` or `\cap` | U+2229 | ∩ | Set intersection |
| `\subset` | U+2282 | ⊂ | Proper subset |
| `\supset` | U+2283 | ⊃ | Proper superset |
| `\in` | U+2208 | ∈ | Element of |
| `\notin` | U+2209 | ∉ | Not element of |
| `\subseteq` | U+2286 | ⊆ | Subset or equal |
| `\supseteq` | U+2287 | ⊇ | Superset or equal |

### Logic
| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\and` or `\wedge` | U+2227 | ∧ | Logical and |
| `\or` or `\vee` | U+2228 | ∨ | Logical or |
| `\not` or `\neg` | U+00AC | ¬ | Logical not |
| `\implies` or `\Rightarrow` | U+27F9 | ⟹ | Implication |
| `\iff` or `\Leftrightarrow` | U+27FA | ⟺ | If and only if |
| `\forall` | U+2200 | ∀ | Universal quantifier |
| `\exists` | U+2203 | ∃ | Existential quantifier |

### Operations
| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\times` | U+00D7 | × | Multiplication |
| `\div` | U+00F7 | ÷ | Division |
| `\ast` | U+2217 | ∗ | Generic operator |
| `\circ` | U+2218 | ∘ | Function composition |

### Relations
| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\neq` or `\ne` | U+2260 | ≠ | Not equal |
| `\leq` or `\le` | U+2264 | ≤ | Less than or equal |
| `\geq` or `\ge` | U+2265 | ≥ | Greater than or equal |
| `\approx` | U+2248 | ≈ | Approximately equal |
| `\sim` | U+223C | ∼ | Similar to |

### Special Symbols
| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\leftarrow` or `\gets` | U+2190 | ← | Assignment |
| `\coloneq` | U+225C | ≜ | Definition |
| `\rightarrow` or `\to` | U+2192 | → | Function type |

## Effect Extensions

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\raise` | U+21AF | ↯ | Raise exception |
| `\handle` | U+21B4 | ↴ | Handle exception |
| `\parallel` | U+2016 | ‖ | Parallel composition |
| `\lceil` | U+2308 | ⌈ | Atomic section start |
| `\rceil` | U+2309 | ⌉ | Atomic section end |
| `\oplus` | U+2295 | ⊕ | Allocate resource |
| `\ominus` | U+2296 | ⊖ | Release resource |
| `\module` | U+1D49C | 𝓜 | Module declaration |
| `\Leftarrow` | U+21D0 | ⇐ | Import |
| `\Rightarrow` | U+21D2 | ⇒ | Export |
| `\send` | U+21C0 | ⇀ | Send (network) |
| `\receive` | U+21BD | ↽ | Receive (network) |

## Additional Operators

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\langle` | U+27E8 | ⟨ | Choice type/angle bracket left |
| `\rangle` | U+27E9 | ⟩ | Choice type/angle bracket right |
| `\path` | U+1F5AB | 🖫 | File path prefix |
| `\up` | U+21E1 | ⇡ | Stream position up |
| `\down` | U+21E3 | ⇣ | Stream position down |
| `\swap` | U+21C6 | ⇆ | Atomic swap |
| `\llangle` | U+27EA | ⟪ | Deep update path start |
| `\rrangle` | U+27EB | ⟫ | Deep update path end |
| `\ulcorner` | U+231C | ⌜ | Code quotation start |
| `\urcorner` | U+231D | ⌝ | Code quotation end |
| `\llcorner` | U+231E | ⌞ | Code evaluation start |
| `\lrcorner` | U+231F | ⌟ | Code evaluation end |
| `\query` | U+003F | ? | Introspection |
| `\break` | U+2A08 | ⧈ | Breakpoint |
| `\trace` | U+270E | ✎ | Trace/log |
| `\delay` | U+23F2 | ⏲ | Delay |
| `\periodic` | U+27F3 | ⟳ | Periodic task |
| `\lbracket` | U+3014 | 〔 | RAII scope start |
| `\rbracket` | U+3015 | 〕 | RAII scope end |

## Type System Symbols

| ASCII Escape | Unicode | Glyph | Usage |
|-------------|---------|-------|-------|
| `\nat` or `\N` | U+2115 | ℕ | Natural numbers |
| `\int` or `\Z` | U+2124 | ℤ | Integers |
| `\rat` or `\Q` | U+211A | ℚ | Rational numbers |
| `\real` or `\R` | U+211D | ℝ | Real numbers |
| `\complex` or `\C` | U+2102 | ℂ | Complex numbers |
| `\bool` or `\B` | U+1D539 | 𝔹 | Booleans |
| `\bot` | U+22A5 | ⊥ | Bottom type |

## Usage Notes

1. **Input methods:**
   - Direct Unicode input (recommended for supported editors)
   - ASCII escape sequences (for compatibility)
   - Editor-specific shortcuts (e.g., Ctrl+Alt+g → γ)

2. **Lexer behavior:**
   - Escapes are processed during tokenization
   - Unknown escapes result in compilation error
   - Mixed Unicode/ASCII in same file is allowed

3. **Pretty-printing:**
   - Always outputs Unicode glyphs (never escapes)
   - Configurable fallback to ASCII for terminals without Unicode support