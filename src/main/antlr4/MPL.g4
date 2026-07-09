grammar MPL;

// The Java package comes from the '-package com.mpl.parser' argument in
// build.gradle. An @header package declaration here would duplicate it.

// ============================================================================
// PARSER RULES
// ============================================================================

program
    : statement* EOF
    ;

statement
    : expr SEMICOLON
    | expr                      // Allow last statement without semicolon
    ;

// Expression hierarchy following precedence table (lowest to highest)
expr
    : seqExpr                   // Level -2: Statement sequencing
    ;

seqExpr
    : parallelExpr (SEMICOLON parallelExpr)*
    ;

parallelExpr
    : assignExpr (PARALLEL assignExpr)*     // Level -1: Parallel composition
    ;

assignExpr
    : condExpr (LEFTARROW assignExpr)?      // Level 0: Assignment (right-assoc)
    ;

// Guarded alternatives: (condition ⟹ result) | fallback
// This is the canonical conditional form. It lives in the precedence chain
// (below assignment, above implication) instead of being a left-recursive
// standalone rule, which previously caused ANTLR error(119).
condExpr
    : impliesExpr (BAR impliesExpr)*
    ;

impliesExpr
    : orExpr (IMPLIES impliesExpr)?         // Level 1: Implication (right-assoc)
    ;

orExpr
    : andExpr (OR andExpr)*                 // Level 2: Logical OR (left-assoc)
    ;

andExpr
    : compareExpr (AND compareExpr)*        // Level 3: Logical AND (left-assoc)
    ;

compareExpr
    : addExpr (compareOp addExpr)?          // Level 4: Comparisons (non-assoc)
    ;

compareOp
    : EQ | NEQ | LT | GT | LEQ | GEQ | APPROX | SIM
    ;

addExpr
    : mulExpr ((PLUS | MINUS) mulExpr)*     // Level 5: Addition/subtraction
    ;

mulExpr
    : composeExpr ((TIMES | DIV | AST) composeExpr)*  // Level 6: Multiplication
    ;

composeExpr
    : unaryExpr (COMPOSE unaryExpr)*        // Level 7: Composition
    ;

unaryExpr
    : prefixOp* postfixExpr                 // Level 8: Prefix operators
    ;

prefixOp
    : RAISE | TRACE | QUERY | BREAK | DELAY
    ;

// Exception handling is a postfix construct: expr ↴ { ↯name ⇒ handler }
// Formerly a standalone rule reachable from atomExpr, which cycled back into
// expr and caused ANTLR error(119) (mutual left recursion).
postfixExpr
    : appExpr handlerSuffix*
    ;

handlerSuffix
    : HANDLE LBRACE handlerClause+ RBRACE
    ;

handlerClause
    : RAISE IDENTIFIER EXPORT expr
    ;

appExpr
    : atomExpr atomExpr*                    // Level 9: Function application
    ;

atomExpr
    : primary
    | LPAREN expr RPAREN
    | block
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
    | set
    | record
    ;

greekVar
    : ALPHA | BETA | GAMMA | DELTA | EPSILON | ZETA | ETA | THETA
    | IOTA | KAPPA | LAMBDA_VAR | MU | NU | XI | OMICRON | PI 
    | RHO | SIGMA | TAU | UPSILON | PHI | CHI | PSI | OMEGA
    ;

typeSymbol
    : NAT | INT | RAT | REAL | COMPLEX | BOOL
    ;

block
    : LBRACE statement* RBRACE
    ;

lambda
    : LAMBDA_VAR pattern (IN expr)? COLON expr
    ;

forall
    : FORALL pattern IN expr COLON expr
    ;

// The | inside ⟨a|b⟩ is consumed by condExpr, so the rule needs no explicit BAR.
choiceType
    : LANGLE expr RANGLE
    ;

atomicSection
    : LCEIL expr RCEIL (UNDERSCORE IDENTIFIER)?
    ;

raiiScope
    : LRAII statement* RRAII
    ;

codeQuote
    : ULCORNER expr URCORNER
    ;

codeEval
    : LLCORNER expr LRCORNER
    ;

periodicTask
    : PERIODIC LPAREN expr COMMA NUMBER IDENTIFIER? RPAREN
    ;

moduleDecl
    : MODULE IDENTIFIER EXPORT block
    ;

pathLiteral
    : PATH STRING
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

set
    : LBRACE (expr (COMMA expr)*)? RBRACE
    ;

record
    : LBRACE fieldAssignment (COMMA fieldAssignment)* RBRACE
    ;

fieldAssignment
    : IDENTIFIER COLON expr
    ;

// ============================================================================
// LEXER RULES
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
LAMBDA_VAR  : 'λ' | '\\lambda' | '\\lam' ;
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
NAT         : 'ℕ' | '\\nat' | '\\N' ;
INT         : 'ℤ' | '\\int' | '\\Z' ;
RAT         : 'ℚ' | '\\rat' | '\\Q' ;
REAL        : 'ℝ' | '\\real' | '\\R' ;
COMPLEX     : 'ℂ' | '\\complex' | '\\C' ;
BOOL        : '𝔹' | '\\bool' | '\\B' ;

// Operators by precedence
SEMICOLON   : ';' ;
PARALLEL    : '‖' | '\\parallel' ;
LEFTARROW   : '←' | '\\leftarrow' | '\\gets' ;
// '\Rightarrow' belongs to EXPORT (⇒); giving it to IMPLIES too fully
// shadowed EXPORT's escape (ANTLR warning 184).
IMPLIES     : '⟹' | '\\implies' ;
OR          : '∨' | '\\or' | '\\vee' ;
AND         : '∧' | '\\and' | '\\wedge' ;
EQ          : '=' ;
NEQ         : '≠' | '\\neq' | '\\ne' ;
LT          : '<' ;
GT          : '>' ;
LEQ         : '≤' | '\\leq' | '\\le' ;
GEQ         : '≥' | '\\geq' | '\\ge' ;
APPROX      : '≈' | '\\approx' ;
SIM         : '∼' | '\\sim' ;
PLUS        : '+' ;
MINUS       : '-' ;
TIMES       : '×' | '\\times' ;
DIV         : '÷' | '\\div' ;
AST         : '∗' | '\\ast' ;
COMPOSE     : '∘' | '\\circ' ;

// Unary operators
RAISE       : '↯' | '\\raise' ;
TRACE       : '✎' | '\\trace' ;
QUERY       : '?' | '\\query' ;
BREAK       : '⧈' | '\\break' ;
DELAY       : '⏲' | '\\delay' ;

// Special operators
// (LAMBDA was fully shadowed by LAMBDA_VAR — warning 184; LAMBDA_VAR is the
// single λ token and the lambda parser rule uses it.)
FORALL      : '∀' | '\\forall' ;
EXISTS      : '∃' | '\\exists' ;
DEFINITION  : '≜' | '\\coloneq' ;
HANDLE      : '↴' | '\\handle' ;
ALLOC       : '⊕' | '\\oplus' ;
RELEASE     : '⊖' | '\\ominus' ;
MODULE      : '𝓜' | '\\module' ;
IMPORT      : '⇐' | '\\Leftarrow' ;
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
DOT         : '.' ;
UNDERSCORE  : '_' ;
BAR         : '|' ;
ARROW       : '→' | '\\rightarrow' | '\\to' ;
MIDDOT      : '‧' ;

// Identifiers
IDENTIFIER
    : [a-zA-Z_][a-zA-Z0-9_]*
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