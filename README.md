# Mathematical Programming Language (MPL)

![Version](https://img.shields.io/badge/version-0.1--alpha-blue)
![Status](https://img.shields.io/badge/status-pre--M0-orange)

A programming language that maintains cognitive universality while supporting all modern programming paradigms through mathematical notation.

## Quick Start

```mpl
✎"Hello, World!"
```

## Repository Structure

- `math_prog_lang.md` - Complete language specification
- `ISSUE_M0_BLOCKERS.md` - Critical decisions needed before M0 implementation
- `glyph-escapes.md` - ASCII escape sequences for all Unicode glyphs
- `precedence.csv` - Operator precedence table
- `examples/` - Example programs from the specification

## M0 Milestones

1. ✅ Language specification consolidated
2. ✅ Pre-M0 audit completed
3. ✅ Lexical blockers resolved (see [ISSUE_M0_BLOCKERS.md](ISSUE_M0_BLOCKERS.md))
4. ⏳ Implement ANTLR 4 grammar
5. ⏳ Create test suite (500 LOC)
6. ⏳ Achieve M0 exit criteria

## M0 Exit Criteria

- [ ] Lexer round-trips every glyph via escape and direct entry
- [ ] Parser accepts all files in `examples/`
- [ ] `grmtools` (or ANTLR diagnostics) reports **0** ambiguities
- [ ] Fuzz seed (10k random tokens) yields no segfault
- [ ] Pretty-printer emits code that re-parses into identical AST

## Contact

- GitHub: @developtheweb
- Email: developtheweb@protonmail.com