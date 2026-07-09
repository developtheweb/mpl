grammar MPL;

// The Java package comes from the '-package com.mpl.parser' argument in
// build.gradle. An @header package declaration here would duplicate it.

// ============================================================================
// PARSER RULES
//
// Structural decisions (see DECISIONS.md for rationale):
//
// * SEMICOLON has exactly one role: it separates expressions in a sequence
//   (`seqExpr`). A trailing semicolon is permitted. There is no separate
//   "statement terminator" concept; the program, blocks, parenthesized
//   groups, atomic sections, RAII scopes and code quotations all contain a
//   single seqExpr.
//
// * Braces are disambiguated structurally:
//     - record: `{ name: expr, ... }`  — at least one `IDENTIFIER : expr`
//     - set:    `{ a, b, ... }`        — at least TWO comma-separated exprs
//     - block:  everything else, including `{}` and `{ x }`
//   A singleton set cannot be written literally (use ∅ and set operations
//   in M1); singleton braces always parse as a block.
//
// * Function calls are `f(a, b)` only — a postfix argument list. Haskell
//   juxtaposition (`f x`) was removed. Nullary calls `f()` are supported.
//
// * ≜ defines (right-associative, binds looser than ←); ← assigns.
//
// * Guarded alternatives `(condition ⟹ result) | fallback` are the one
//   conditional form, wired in as the condExpr precedence level.
// ============================================================================

program
    : seqExpr? EOF
    ;

seqExpr
    : expr (SEMICOLON expr)* SEMICOLON?
    ;

// Expression precedence chain, lowest binding first.
expr
    : parallelExpr
    ;

parallelExpr
    : defExpr (PARALLEL defExpr)*           // ‖ parallel composition
    ;

defExpr
    : assignExpr (DEFINITION defExpr)?      // ≜ definition (right-assoc)
    ;

assignExpr
    : condExpr (LEFTARROW assignExpr)?      // ← assignment (right-assoc)
    ;

// Guarded alternatives: (condition ⟹ result) | fallback
// The one conditional form. The BAR inside ⟨a|b⟩ is also consumed here.
condExpr
    : impliesExpr (BAR impliesExpr)*
    ;

impliesExpr
    : orExpr (IMPLIES impliesExpr)?         // ⟹ guard/implication (right-assoc)
    ;

orExpr
    : andExpr (OR andExpr)*                 // ∨ logical OR
    ;

andExpr
    : cmpExpr (AND cmpExpr)*                // ∧ logical AND
    ;

cmpExpr
    : addExpr (compareOp addExpr)?          // comparisons (non-associative)
    ;

compareOp
    : EQ | NEQ | LT | GT | LEQ | GEQ | APPROX | SIM
    ;

addExpr
    : mulExpr ((PLUS | MINUS) mulExpr)*
    ;

mulExpr
    : composeExpr ((TIMES | DIV | AST) composeExpr)*
    ;

composeExpr
    : unaryExpr (COMPOSE unaryExpr)*        // ∘ function composition
    ;

unaryExpr
    : (prefixOp | channelOp)* postfixExpr
    ;

// MINUS doubles as unary negation: -x
prefixOp
    : RAISE | TRACE | BREAK | DELAY | MINUS
    ;

// Channel operations are subscripted prefix operators: ⇀_ch expr, ↽_ch expr
channelOp
    : (SEND | RECEIVE) UNDERSCORE IDENTIFIER
    ;

// Postfix operators: call, qualified access, resource alloc/release, handler.
postfixExpr
    : atomExpr postfixOp*
    ;

postfixOp
    : callArgs                              // f(a, b) — the one call syntax
    | MIDDOT IDENTIFIER                     // Module‧member
    | ALLOC                                 // resource ⊕
    | RELEASE                               // resource ⊖
    | HANDLE handlerBlock                   // expr ↴ { ↯pat ⟹ expr; ... }
    ;

callArgs
    : LPAREN (expr (COMMA expr)*)? RPAREN
    ;

handlerBlock
    : LBRACE handlerClause (SEMICOLON handlerClause)* SEMICOLON? RBRACE
    ;

// ↯identifier binds the exception; ↯"literal" matches a specific message.
// The clause arrow is ⟹, mirroring guarded alternatives.
handlerClause
    : RAISE (IDENTIFIER | STRING) IMPLIES expr
    ;

atomExpr
    : LPAREN seqExpr RPAREN
    | lambda
    | forall
    | choiceType
    | atomicSection
    | raiiScope
    | codeQuote
    | codeEval
    | periodicTask
    | moduleDecl
    | pathLiteral
    | record
    | set
    | block
    | primary
    ;

primary
    : IDENTIFIER
    | greekVar
    | NUMBER
    | STRING
    | RAWSTRING
    | TRUE
    | FALSE
    | BOTTOM
    | EMPTYSET
    | typeSymbol
    | list
    ;

greekVar
    : ALPHA | BETA | GAMMA | DELTA | EPSILON | ZETA | ETA | THETA
    | IOTA | KAPPA | LAMBDA_VAR | MU | NU | XI | OMICRON | PI
    | RHO | SIGMA | TAU | UPSILON | PHI | CHI | PSI | OMEGA
    ;

typeSymbol
    : NAT | INT | RAT | REAL | COMPLEX | BOOL
    ;

// λx: body   λx,y: body   λx∈ℝ: body — parameters are a bare pattern list.
lambda
    : LAMBDA_VAR pattern (IN condExpr)? COLON expr
    ;

forall
    : FORALL pattern IN condExpr COLON expr
    ;

// The | inside ⟨a|b⟩ is consumed by condExpr, so the rule needs no explicit BAR.
choiceType
    : LANGLE expr RANGLE
    ;

atomicSection
    : LCEIL seqExpr RCEIL (UNDERSCORE IDENTIFIER)?
    ;

raiiScope
    : LRAII seqExpr? RRAII
    ;

codeQuote
    : ULCORNER seqExpr URCORNER
    ;

codeEval
    : LLCORNER seqExpr LRCORNER
    ;

periodicTask
    : PERIODIC LPAREN seqExpr COMMA NUMBER IDENTIFIER? RPAREN
    ;

moduleDecl
    : MODULE IDENTIFIER EXPORT block
    ;

pathLiteral
    : PATH (STRING | IDENTIFIER)
    ;

// Rewritten from the left-recursive, empty-tail form that caused error(148).
pattern
    : patternAtom (COMMA patternAtom)*
    ;

patternAtom
    : IDENTIFIER
    | greekVar
    | UNDERSCORE
    ;

list
    : LBRACK (expr (COMMA expr)*)? RBRACK
    ;

// At least two elements — singleton braces parse as a block (see header note).
set
    : LBRACE expr (COMMA expr)+ RBRACE
    ;

record
    : LBRACE fieldAssignment (COMMA fieldAssignment)* RBRACE
    ;

fieldAssignment
    : IDENTIFIER COLON expr
    ;

block
    : LBRACE seqExpr? RBRACE
    ;

// ============================================================================
// LEXER RULES
//
// Exactly one ASCII escape per glyph (One Right Answer). The authoritative
// escape table is glyph-escapes.md, which must match these rules exactly.
// ============================================================================

// Keywords
IN          : '∈' | '\\in' ;
TRUE        : 'true' ;
FALSE       : 'false' ;

// Greek letters
ALPHA       : 'α' | '\\alpha' ;
BETA        : 'β' | '\\beta' ;
GAMMA       : 'γ' | '\\gamma' ;
DELTA       : 'δ' | '\\delta' ;
EPSILON     : 'ε' | '\\epsilon' ;
ZETA        : 'ζ' | '\\zeta' ;
ETA         : 'η' | '\\eta' ;
THETA       : 'θ' | '\\theta' ;
IOTA        : 'ι' | '\\iota' ;
KAPPA       : 'κ' | '\\kappa' ;
LAMBDA_VAR  : 'λ' | '\\lambda' ;
MU          : 'μ' | '\\mu' ;
NU          : 'ν' | '\\nu' ;
XI          : 'ξ' | '\\xi' ;
OMICRON     : 'ο' | '\\omicron' ;
PI          : 'π' | '\\pi' ;
RHO         : 'ρ' | '\\rho' ;
SIGMA       : 'σ' | '\\sigma' ;
TAU         : 'τ' | '\\tau' ;
UPSILON     : 'υ' | '\\upsilon' ;
PHI         : 'φ' | '\\phi' ;
CHI         : 'χ' | '\\chi' ;
PSI         : 'ψ' | '\\psi' ;
OMEGA       : 'ω' | '\\omega' ;

// Type symbols
NAT         : 'ℕ' | '\\nat' ;
INT         : 'ℤ' | '\\int' ;
RAT         : 'ℚ' | '\\rat' ;
REAL        : 'ℝ' | '\\real' ;
COMPLEX     : 'ℂ' | '\\complex' ;
BOOL        : '𝔹' | '\\bool' ;

// Operators by precedence
SEMICOLON   : ';' ;
PARALLEL    : '‖' | '\\parallel' ;
LEFTARROW   : '←' | '\\leftarrow' ;
// '\Rightarrow' belongs to EXPORT (⇒); giving it to IMPLIES too fully
// shadowed EXPORT's escape (ANTLR warning 184).
IMPLIES     : '⟹' | '\\implies' ;
OR          : '∨' | '\\or' ;
AND         : '∧' | '\\and' ;
EQ          : '=' ;
NEQ         : '≠' | '\\neq' ;
LT          : '<' ;
GT          : '>' ;
LEQ         : '≤' | '\\leq' ;
GEQ         : '≥' | '\\geq' ;
APPROX      : '≈' | '\\approx' ;
SIM         : '∼' | '\\sim' ;
PLUS        : '+' ;
MINUS       : '-' ;
TIMES       : '×' | '\\times' ;
DIV         : '÷' | '\\div' | '/' ;
AST         : '∗' | '\\ast' ;
COMPOSE     : '∘' | '\\circ' ;

// Unary operators
RAISE       : '↯' | '\\raise' ;
TRACE       : '✎' | '\\trace' ;
BREAK       : '⧈' | '\\break' ;
DELAY       : '⏲' | '\\delay' ;

// Special operators
// (LAMBDA was fully shadowed by LAMBDA_VAR — warning 184; LAMBDA_VAR is the
// single λ token and the lambda parser rule uses it.)
FORALL      : '∀' | '\\forall' ;
DEFINITION  : '≜' | '\\coloneq' ;
HANDLE      : '↴' | '\\handle' ;
ALLOC       : '⊕' | '\\oplus' ;
RELEASE     : '⊖' | '\\ominus' ;
MODULE      : '𝓜' | '\\module' ;
EXPORT      : '⇒' | '\\Rightarrow' ;
SEND        : '⇀' | '\\send' ;
RECEIVE     : '↽' | '\\receive' ;
PATH        : '🖫' | '\\path' ;
PERIODIC    : '⟳' | '\\periodic' ;
BOTTOM      : '⊥' | '\\bot' ;
EMPTYSET    : '∅' | '\\emptyset' ;

// Delimiters
LPAREN      : '(' ;
RPAREN      : ')' ;
LBRACK      : '[' ;
RBRACK      : ']' ;
LBRACE      : '{' ;
RBRACE      : '}' ;
LANGLE      : '⟨' | '\\langle' ;
RANGLE      : '⟩' | '\\rangle' ;
LCEIL       : '⌈' | '\\lceil' ;
RCEIL       : '⌉' | '\\rceil' ;
LRAII       : '〔' | '\\lbracket' ;
RRAII       : '〕' | '\\rbracket' ;
ULCORNER    : '⌜' | '\\ulcorner' ;
URCORNER    : '⌝' | '\\urcorner' ;
LLCORNER    : '⌞' | '\\llcorner' ;
LRCORNER    : '⌟' | '\\lrcorner' ;

// Other symbols
COLON       : ':' ;
COMMA       : ',' ;
UNDERSCORE  : '_' ;
BAR         : '|' ;
MIDDOT      : '‧' ;

// Identifiers. A leading underscore is NOT allowed: subscripts such as
// ⌉_db_lock and ↽_socket must lex as UNDERSCORE + IDENTIFIER, not as a
// single identifier "_db_lock".
IDENTIFIER
    : [a-zA-Z][a-zA-Z0-9_]*
    ;

// Numbers
NUMBER
    : INTEGER
    | FLOAT
    | HEX
    | BINARY
    ;

fragment INTEGER
    : [0-9]+
    ;

fragment FLOAT
    : [0-9]+ '.' [0-9]+
    | [0-9]+ '.' [0-9]+ [eE] [+-]? [0-9]+
    ;

fragment HEX
    : '0x' [0-9a-fA-F]+
    ;

fragment BINARY
    : '0b' [01]+
    ;

// String literals
STRING
    : '"' (ESC | ~["\\])* '"'
    ;

RAWSTRING
    : '"""' .*? '"""'
    ;

fragment ESC
    : '\\' [\\nrt0"]
    | '\\u{' [0-9a-fA-F]+ '}'
    ;

// Comments
COMMENT
    : '--' ~[\r\n]* -> skip
    ;

MULTILINE_COMMENT
    : '{-' (MULTILINE_COMMENT | .)*? '-}' -> skip
    ;

// Whitespace
WS
    : [ \t\r\n]+ -> skip
    ;
