# 🚀 Lock lexical & grammar spec for M0

## Overview
This issue tracks the resolution of three critical blockers that must be decided before implementing the ANTLR 4 grammar for MPL. These decisions are required to ensure the lexer can be implemented without surprises and that all M0 exit criteria are objectively testable.

## Blockers

### 1. Comment Syntax 🚫
**Status:** MISSING  
**Decision needed by:** Before lexer PR is merged  
**Rationale:** Source files cannot compile without comment support

**Options to consider:**
- `--` till EOL (Ada/Haskell style)
- `/* ... */` (C style) 
- `#` till EOL (Python/Ruby style)
- Support for both single-line and multi-line comments

**Recommendation:** Use `--` for single-line and `{- ... -}` for multi-line (Haskell-style) to align with functional paradigm

### 2. String Literal Rules ⚠️
**Status:** INCOMPLETE  
**Decision needed by:** Before lexer PR is merged  
**Rationale:** Required for hello-world sample

**Decisions needed:**
- Escape sequences: Standard set (`\n`, `\t`, `\\`, `\"`) + Unicode (`\u{1F600}`)
- String delimiters: Double quotes only or support for raw strings?
- Multi-line string support?
- String interpolation syntax (or defer to M1)?

**Recommendation:** 
- Use `"..."` for regular strings with standard escapes
- Add `"""..."""` for multi-line raw strings (no escapes)
- Defer interpolation to M1

### 3. Path Literal Fallback ⚠️
**Status:** INCOMPLETE  
**Decision needed by:** Before lexer PR is merged  
**Rationale:** `🖫` glyph may not render on all systems

**Options:**
- Make `🖫` required (pure Unicode approach)
- Add ASCII escape like `@path"..."` or `#path"..."`
- Use `\path` as the ASCII escape (consistent with other escapes)

**Recommendation:** Support both `🖫"..."` and `\path"..."` for maximum compatibility

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

## Action Items
1. Make decisions on all three blockers
2. Update `math_prog_lang.md` with decisions
3. Create `docs/lexical-spec.md` with complete token rules
4. Tag specification as `v0.1-alpha`

---
**Assignee:** @developtheweb  
**Labels:** `blocker`, `M0`, `specification`, `grammar`