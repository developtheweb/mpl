# Changelog

All notable changes to the Mathematical Programming Language (MPL) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Gradle wrapper, so `./gradlew build` works from a fresh clone
- CI workflow: grammar build (ANTLR warnings are errors), tests, example parsing
- Documentation test: every ```mpl code block in README, spec and whitepaper must parse
- Canonical call syntax `f(a, b)` with nullary calls `f()`
- Wired-in operators: `≜` definition, `⊕`/`⊖` postfix resources, `⇀_ch`/`↽_ch` channels, `‧` module access, unary minus, `/` as ASCII alias of `÷`
- DECISIONS.md recording each design resolution with rejected alternatives

### Changed
- One canonical form per construct: guarded alternatives `(c ⟹ r) | fallback`, `✎` output, `↯pattern ⟹ expr` handler clauses, exactly one ASCII escape per glyph
- `;` has a single role (sequence separator, trailing permitted)
- Identifiers may no longer start with `_`, so subscripts lex correctly
- precedence.csv and glyph-escapes.md regenerated to match the grammar exactly
- README claims reduced to what CI verifies
- Comprehensive enterprise-level documentation structure
- AGPLv3 license for strong copyleft protection (changed from MIT)
- README transformed into moonshot vision document emphasizing cognitive justice
- Whitepaper updated to v2.0 with educational narrative focus

### Fixed
- Grammar compiles: removed mutual left recursion (errors 119/148) and shadowed tokens (warning 184)
- Generated parser package no longer declared twice
- Gradle finds the grammar (src/main/antlr4) and the ParseExamples main class
- Test harness uses CharStreams; supplementary-plane glyphs (𝔹, 𝓜, 🖫) now tokenize
- Examples 03 and 05 parse (canonical handler arrow; real placeholder body)

### Removed
- Dead tokens with no parser rule: `?` (QUERY), `∃`, `⇐`, `→`, `.`
- Juxtaposition function application (`f x`)
- C-style ternary and `📤` from all documentation

## [2.0.0] - 2025-01-26

### Added
- Complete ANTLR 4 grammar with 70+ mathematical operators
- Support for functional, imperative, concurrent, and object-oriented paradigms
- ASCII escape sequences for all Unicode symbols
- Comprehensive test suite with 663 lines of test code
- 10 example programs demonstrating real-world usage
- Academic whitepaper with technical specification
- Symbol reference guide (glyph-escapes.md)
- Operator precedence table

### Changed
- Moved from theoretical concept to working parser implementation
- Established Fatima Test as core design principle

### Fixed
- All M0 blocker issues resolved
- Zero shift/reduce conflicts in grammar
- Operator precedence validated through extensive testing

## [1.0.0] - 2024-12-15

### Added
- Initial concept and vision for Mathematical Programming Language
- Basic symbol set proposal
- Preliminary grammar sketch
- Mission statement for cognitive universality

---

## Version History Summary

- **2.0.0** - First working implementation with complete grammar
- **1.0.0** - Initial concept and vision

[Unreleased]: https://github.com/developtheweb/mpl/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/developtheweb/mpl/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/developtheweb/mpl/releases/tag/v1.0.0