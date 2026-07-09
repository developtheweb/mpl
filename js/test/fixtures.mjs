// Test fixtures copied verbatim from mpl_codes js/site.js @ 5b50cc0 when
// the interpreter test suite migrated into this repo. These are the exact
// programs the site ships; the entries' third field is the site's i18n
// label key, preserved untouched so nothing about the facts changed in the
// migration.

export const SYMBOLS = [
 ['✎','\\trace','sym_trace'],['λ','\\lambda','sym_lambda'],['≜','\\coloneq','sym_def'],
 ['←','\\leftarrow','sym_assign'],['⟹','\\implies','sym_implies'],['|','|','sym_bar'],
 ['∀','\\forall','sym_forall'],['∈','\\in','sym_in'],['∧','\\and','sym_and'],
 ['∨','\\or','sym_or'],['≤','\\leq','sym_leq'],['≥','\\geq','sym_geq'],
 ['≠','\\neq','sym_neq'],['×','\\times','sym_times'],['÷','\\div','sym_div'],
 ['⊥','\\bot','sym_bot']
];

export const EXERCISES = [
 {t:'ex1_t',d:'ex1_d',lvl:'lvl1',code:'✎ "Hello, World!";\n✎ "Jambo!";\n✎ "你好!";\n✎ "مرحبا!";'},
 {t:'ex2_t',d:'ex2_d',lvl:'lvl1',code:'length ← 5;\nwidth ← 3;\n✎("Area = " + length × width);'},
 {t:'ex3_t',d:'ex3_d',lvl:'lvl2',code:'fact ≜ λn: (n ≤ 1 ⟹ 1) | (n × fact(n - 1));\n✎("5! = " + fact(5));'},
 {t:'ex4_t',d:'ex4_d',lvl:'lvl2',code:'total ← 0;\n∀ n ∈ [1, 2, 3, 4, 5]: total ← total + n × n;\n✎("Σ = " + total);'},
 {t:'ex5_t',d:'ex5_d',lvl:'lvl2',code:'even ≜ λn: (n = 0 ⟹ true) | ((n = 1 ⟹ false) | even(n - 2));\n∀ n ∈ [1, 2, 3, 4, 5, 6, 7, 8]: (even(n) ⟹ ✎(n)) | ⊥;'},
 {t:'ex6_t',d:'ex6_d',lvl:'lvl3',code:'twice ≜ λf: λx: f(f(x));\ninc ≜ λn: n + 1;\n✎ twice(inc)(40);'}
];

export const DEFAULT_PROGRAM = '-- سلام · 你好 · Hola · Hello\ngreet ≜ λname: ✎("Salaam, " + name + "!");\ngreet("Fatima");\n\nfact ≜ λn: (n ≤ 1 ⟹ 1) | (n × fact(n - 1));\n✎("5! = " + fact(5));';
export const HERO_PROGRAM = 'fact ≜ λn: (n ≤ 1 ⟹ 1) | (n × fact(n - 1));\n✎("5! = " + fact(5));';
