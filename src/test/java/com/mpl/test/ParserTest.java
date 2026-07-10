package com.mpl.test;

import org.junit.Test;
import java.io.IOException;

/**
 * Test suite for MPL parser - verifying syntax rules
 */
public class ParserTest extends MPLTestBase {
    
    @Test
    public void testBasicExpressions() throws IOException {
        assertParses("123;");
        assertParses("\"hello\";");
        assertParses("true;");
        assertParses("false;");
        assertParses("α;");
        assertParses("foo;");
    }
    
    @Test
    public void testArithmetic() throws IOException {
        assertParses("1 + 2;");
        assertParses("3 × 4;");
        assertParses("5 ÷ 2;");
        assertParses("a - b;");
        assertParses("x ∗ y ∗ z;");
    }
    
    @Test
    public void testPrecedence() throws IOException {
        // Multiplication before addition
        assertParses("1 + 2 × 3;");
        assertParses("a × b + c × d;");
        
        // Comparison after arithmetic
        assertParses("a + b < c × d;");
        assertParses("x ≥ y + 1;");
        
        // Logic after comparison
        assertParses("a < b ∧ c > d;");
        assertParses("x = y ∨ p ≠ q;");
        
        // Assignment is lowest precedence
        assertParses("x ← a + b;");
        assertParses("y ← p ∧ q;");
    }
    
    @Test
    public void testParentheses() throws IOException {
        assertParses("(1 + 2) × 3;");
        assertParses("((a + b) × c);");
        assertParses("(x ← y);");
    }
    
    // Function calls are f(a, b) only — juxtaposition (f x) was removed.
    @Test
    public void testFunctionCalls() throws IOException {
        assertParses("f(x);");
        assertParses("g(a, b, c);");
        assertParses("sin(π);");
        assertParses("f(x)(y);");
        assertParses("f();");                  // nullary call
        assertParses("mergeResults();");
    }
    
    @Test
    public void testLambdas() throws IOException {
        assertParses("λx: x + 1;");
        assertParses("λx∈ℕ: x × 2;");
        assertParses("λa: λb: a + b;");
        assertParses("λa, b: a + b;");         // multi-parameter pattern
        assertParses("(λx: x × x)(5);");       // was (λx: x × x) 5 — juxtaposition removed
    }
    
    @Test
    public void testForall() throws IOException {
        assertParses("∀x∈S: P(x);");           // was P x — juxtaposition removed
        assertParses("∀n∈ℕ: n ≥ 0;");
        assertParses("∀x∈A: ∀y∈B: f(x, y);");  // was f x y — juxtaposition removed
    }
    
    @Test
    public void testDefinitions() throws IOException {
        assertParses("f ≜ λx: x + 1;");
        assertParses("pi ≜ 3.14159;");
        assertParses("id ≜ λx: x;");
        assertParses("π ≜ 3.14159;");          // greek letter on the left
        assertParses("f ≜ λ: 1;");             // ruling 18: nullary λ, bare colon
    }
    
    @Test
    public void testBlocks() throws IOException {
        assertParses("{ x ← 1; y ← 2; x + y }");
        // Was "{ a ← b; { c ← d; } e }": the inner block juxtaposed with e
        // relied on juxtaposition application, which was removed.
        assertParses("{ a ← b; { c ← d; }; e }");
        assertParses("{ }");
        assertParses("{ x }");                 // singleton braces are a block
    }
    
    @Test
    public void testConditionals() throws IOException {
        assertParses("x > 0 ⟹ x | -x;");
        assertParses("(n = 0 ⟹ 1) | (n × fact(n-1));");
        assertParses("(n≤1 ⟹ 1) | (n×factorial(n-1));");
    }

    @Test
    public void testUnaryMinus() throws IOException {
        assertParses("-x;");
        assertParses("a - -b;");
        assertParses("f(-1);");
    }
    
    @Test
    public void testChoiceTypes() throws IOException {
        assertParses("⟨\"ok\"|\"error\"⟩;");
        assertParses("⟨x|⊥⟩;");
        assertParses("⟨result|exception⟩;");
    }
    
    @Test
    public void testLists() throws IOException {
        assertParses("[];");
        assertParses("[1, 2, 3];");
        assertParses("[x, y, z];");
        assertParses("[[1], [2], [3]];");
    }
    
    @Test
    public void testSets() throws IOException {
        assertParses("∅;");
        assertParses("{1, 2, 3};");
        assertParses("{x, y, z};");
    }
    
    @Test
    public void testRecords() throws IOException {
        assertParses("{name: \"Alice\", age: 30};");
        assertParses("{x: 1, y: 2, z: 3};");
    }
    
    @Test
    public void testEffects() throws IOException {
        assertParses("↯\"error\";");
        assertParses("✎\"log message\";");
        assertParses("⏲ 100;");
        // Canonical handler clause: ↯pattern ⟹ expr (was ↯e ⇒ handle e)
        assertParses("x ↴ {↯e ⟹ handle(e)};");
        assertParses("x ↴ {↯\"Invalid user\" ⟹ ⊥};");
        // Multiple clauses are semicolon-separated
        assertParses("x ↴ {↯\"overflow\" ⟹ 0; ↯e ⟹ ↯e};");
    }

    @Test
    public void testResources() throws IOException {
        assertParses("conn ← database ⊕;");
        assertParses("conn ⊖;");
        assertParses("socket ← bind(port) ⊕;");
    }

    @Test
    public void testChannels() throws IOException {
        assertParses("data ← ↽_socket request;");
        assertParses("⇀_socket response;");
    }

    @Test
    public void testModuleAccess() throws IOException {
        assertParses("Mathematics‧sin(angle);");
        assertParses("A‧B‧f(x);");
    }
    
    @Test
    public void testParallel() throws IOException {
        assertParses("a ‖ b;");
        assertParses("task1 ‖ task2 ‖ task3;");
        assertParses("f(x) ‖ g(y);");          // was (f x) ‖ (g y) — juxtaposition removed
    }
    
    @Test
    public void testAtomic() throws IOException {
        assertParses("⌈x ← x + 1⌉;");
        // Was "⌈critical section⌉_lock" — juxtaposition removed
        assertParses("⌈criticalSection()⌉_lock;");
        assertParses("⌈a ← 1; b ← 2⌉_db_lock;");
    }
    
    @Test
    public void testRAII() throws IOException {
        // Was "use r" / "open \"file\"" / "read f" — juxtaposition removed
        assertParses("〔 r ← resource ⊕; use(r) 〕;");
        assertParses("〔 f ← open(\"file\"); read(f) 〕;");
    }
    
    @Test
    public void testCodeQuotation() throws IOException {
        assertParses("⌜λx: x + 1⌝;");
        assertParses("⌞quote⌟;");
    }
    
    @Test
    public void testModules() throws IOException {
        assertParses("𝓜 Math ⇒ { pi ≜ 3.14; };");
        assertParses("𝓜 Utils ⇒ { f ≜ λx: x; g ≜ λy: y × 2; };");
    }
    
    @Test
    public void testPaths() throws IOException {
        assertParses("🖫\"file.txt\";");
        assertParses("\\path\"directory/file\";");
        assertParses("readFile(🖫path);");      // identifier form
    }
    
    @Test
    public void testComplexExpressions() throws IOException {
        // Factorial
        assertParses("factorial ≜ λn∈ℕ: (n≤1 ⟹ 1) | (n×factorial(n-1));");
        
        // File processing (canonical handler clause is ↯pattern ⟹ expr)
        assertParses("processFile ≜ λpath: { data ← readFile(🖫path); result ← transform(data); writeFile(result, 🖫\"output.txt\"); ⟨\"success\"|\"failed\"⟩ } ↴ {↯e ⟹ ⟨⊥|e⟩};");
        
        // Network server
        assertParses("server ≜ λport: 〔 socket ← bind(port) ⊕; ∀request∈acceptLoop(socket): ( data ← ↽_socket request; response ← processRequest(data); ⇀_socket response ) ‖ handleNext() 〕;");
    }
    
    @Test
    public void testInvalidSyntax() throws IOException {
        // Missing semicolons
        assertDoesNotParse("x ← 1 y ← 2");
        
        // Mismatched parentheses
        assertDoesNotParse("(x + y))");
        assertDoesNotParse("((x + y)");
        
        // Invalid operators
        assertDoesNotParse("x ++ y;");
        assertDoesNotParse("a ** b;");
        
        // Invalid lambda syntax (λ: x became VALID under ruling 18)
        assertDoesNotParse("λx y: x + y;");
        // Ruling 25: the parenthesized parameter spelling stays rejected.
        assertDoesNotParse("λ(a, b): a;");
        // Ruling 26: λ is reserved — never an identifier.
        assertDoesNotParse("λ ≜ 3;");
        assertDoesNotParse("{λ};");

        // Juxtaposition application was removed — calls need parentheses
        assertDoesNotParse("f x;");
        assertDoesNotParse("g a b c;");

        // The C-style ternary is not MPL — use (cond ⟹ a) | b
        assertDoesNotParse("cond ? a : b;");
    }
    
    @Test
    public void testSemicolonRules() throws IOException {
        // Semicolon required between statements
        assertParses("x ← 1; y ← 2;");
        
        // No semicolon before closing brace
        assertParses("{ x ← 1; y ← 2 }");
        
        // Last statement in program can omit semicolon
        assertParses("x ← 1");
        assertParses("y ← 2");
    }
}