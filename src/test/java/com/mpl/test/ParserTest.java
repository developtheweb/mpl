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
    
    @Test
    public void testFunctionApplication() throws IOException {
        assertParses("f x;");
        assertParses("g a b c;");
        assertParses("sin π;");
        assertParses("(f x) y;");
    }
    
    @Test
    public void testLambdas() throws IOException {
        assertParses("λx: x + 1;");
        assertParses("λx∈ℕ: x × 2;");
        assertParses("λa: λb: a + b;");
        assertParses("(λx: x × x) 5;");
    }
    
    @Test
    public void testForall() throws IOException {
        assertParses("∀x∈S: P x;");
        assertParses("∀n∈ℕ: n ≥ 0;");
        assertParses("∀x∈A: ∀y∈B: f x y;");
    }
    
    @Test
    public void testDefinitions() throws IOException {
        assertParses("f ≜ λx: x + 1;");
        assertParses("pi ≜ 3.14159;");
        assertParses("id ≜ λx: x;");
    }
    
    @Test
    public void testBlocks() throws IOException {
        assertParses("{ x ← 1; y ← 2; x + y }");
        assertParses("{ a ← b; { c ← d; } e }");
        assertParses("{ }");
    }
    
    @Test
    public void testConditionals() throws IOException {
        assertParses("x > 0 ⟹ x | -x;");
        assertParses("(n = 0 ⟹ 1) | (n × fact (n-1));");
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
        assertParses("x ↴ {↯e ⇒ handle e};");
    }
    
    @Test
    public void testParallel() throws IOException {
        assertParses("a ‖ b;");
        assertParses("task1 ‖ task2 ‖ task3;");
        assertParses("(f x) ‖ (g y);");
    }
    
    @Test
    public void testAtomic() throws IOException {
        assertParses("⌈x ← x + 1⌉;");
        assertParses("⌈critical section⌉_lock;");
    }
    
    @Test
    public void testRAII() throws IOException {
        assertParses("〔 r ← resource ⊕; use r 〕;");
        assertParses("〔 f ← open \"file\"; read f 〕;");
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
    }
    
    @Test
    public void testComplexExpressions() throws IOException {
        // Factorial
        assertParses("factorial ≜ λn∈ℕ: (n≤1 ⟹ 1) | (n×factorial(n-1));");
        
        // File processing
        assertParses("processFile ≜ λpath: { data ← readFile(🖫path); result ← transform(data); writeFile(result, 🖫\"output.txt\"); ⟨\"success\"|\"failed\"⟩ } ↴ {↯e ⇒ ⟨⊥|e⟩};");
        
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
        
        // Invalid lambda syntax
        assertDoesNotParse("λ: x;");
        assertDoesNotParse("λx y: x + y;");
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