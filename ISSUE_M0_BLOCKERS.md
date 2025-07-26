# 🚀 Lock lexical & grammar spec for M0

## ✅ RESOLVED - All blockers have been addressed

## Overview
This issue tracked the resolution of three critical blockers that must be decided before implementing the ANTLR 4 grammar for MPL. All decisions have been made and incorporated into the specification.

## Blockers

### 1. Comment Syntax ✅
**Status:** RESOLVED  
**Decision needed by:** Before lexer PR is merged  
**Rationale:** Source files cannot compile without comment support

**Options to consider:**
- `--` till EOL (Ada/Haskell style)
- `/* ... */` (C style) 
- `#` till EOL (Python/Ruby style)
- Support for both single-line and multi-line comments

**DECISION:** Use `--` for single-line and `{- ... -}` for multi-line (Haskell-style) to align with functional paradigm

### 2. String Literal Rules ✅
**Status:** RESOLVED  
**Decision needed by:** Before lexer PR is merged  
**Rationale:** Required for hello-world sample

**Decisions needed:**
- Escape sequences: Standard set (`\n`, `\t`, `\\`, `\"`) + Unicode (`\u{1F600}`)
- String delimiters: Double quotes only or support for raw strings?
- Multi-line string support?
- String interpolation syntax (or defer to M1)?

**DECISION:** 
- Use `"..."` for regular strings with standard escapes (`\n`, `\t`, `\\`, `\"`, `\u{XXXXXX}`)
- Add `"""..."""` for multi-line raw strings (no escapes)
- String interpolation deferred to M1

### 3. Path Literal Fallback ✅
**Status:** RESOLVED  
**Decision needed by:** Before lexer PR is merged  
**Rationale:** `🖫` glyph may not render on all systems

**Options:**
- Make `🖫` required (pure Unicode approach)
- Add ASCII escape like `@path"..."` or `#path"..."`
- Use `\path` as the ASCII escape (consistent with other escapes)

**DECISION:** Support both `🖫"..."` and `\path"..."` for maximum compatibility

## Additional Lexical Decisions

### ASCII Escape Mapping
Need complete one-to-one table for all Unicode glyphs. Current partial list:
- `\gamma` → `γ`
- `\lam` or `\lambda` → `λ`
- `\Rightarrow` → `⇒`
- etc.

### Number Literal Format
- Decimal: `123`, `123.456`, `1.23e10`
- Hex: `0x1A2B`
- Binary: `0b1101`
- Suffixes: `_i32`, `_f64`, `_bigint` (or defer to M1?)

## Exit Criteria
Once this issue is closed, we can:
- [ ] Implement the lexer with confidence
- [ ] Parse all example programs
- [ ] Generate syntax highlighting for editors
- [ ] Create the `glyph-escapes.md` reference

## Resolution Summary

All blockers have been resolved and incorporated into the specification:

1. **Comments:** `--` for single-line, `{- ... -}` for multi-line (nestable)
2. **Strings:** `"..."` with escapes, `"""..."""` for raw multi-line
3. **Paths:** Both `🖫"..."` and `\path"..."` supported

## Completed Actions
- ✅ All decisions made and documented
- ✅ Updated `math_prog_lang.md` with lexical rules
- ✅ Updated `glyph-escapes.md` with string escape sequences
- ✅ All example files updated with proper syntax
- ✅ Ready to tag specification as `v0.1-alpha`

---
**Assignee:** @developtheweb  
**Labels:** `blocker`, `M0`, `specification`, `grammar`