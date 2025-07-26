package com.mpl.test;

import com.mpl.parser.MPLLexer;
import org.junit.Test;
import java.io.IOException;

/**
 * Test suite for MPL lexer - verifying token recognition
 */
public class LexerTest extends MPLTestBase {
    
    @Test
    public void testGreekLetters() throws IOException {
        // Direct Unicode
        assertTokenTypes("α", MPLLexer.ALPHA);
        assertTokenTypes("β", MPLLexer.BETA);
        assertTokenTypes("γ", MPLLexer.GAMMA);
        assertTokenTypes("λ", MPLLexer.LAMBDA_VAR);
        assertTokenTypes("π", MPLLexer.PI);
        assertTokenTypes("ω", MPLLexer.OMEGA);
        
        // ASCII escapes
        assertTokenTypes("\\alpha", MPLLexer.ALPHA);
        assertTokenTypes("\\beta", MPLLexer.BETA);
        assertTokenTypes("\\gamma", MPLLexer.GAMMA);
        assertTokenTypes("\\lambda", MPLLexer.LAMBDA_VAR);
        assertTokenTypes("\\pi", MPLLexer.PI);
        assertTokenTypes("\\omega", MPLLexer.OMEGA);
    }
    
    @Test
    public void testTypeSymbols() throws IOException {
        // Unicode
        assertTokenTypes("ℕ", MPLLexer.NAT);
        assertTokenTypes("ℤ", MPLLexer.INT);
        assertTokenTypes("ℚ", MPLLexer.RAT);
        assertTokenTypes("ℝ", MPLLexer.REAL);
        assertTokenTypes("ℂ", MPLLexer.COMPLEX);
        assertTokenTypes("𝔹", MPLLexer.BOOL);
        
        // ASCII escapes
        assertTokenTypes("\\nat", MPLLexer.NAT);
        assertTokenTypes("\\int", MPLLexer.INT);
        assertTokenTypes("\\real", MPLLexer.REAL);
        assertTokenTypes("\\bool", MPLLexer.BOOL);
    }
    
    @Test
    public void testOperators() throws IOException {
        // Arithmetic
        assertTokenTypes("+", MPLLexer.PLUS);
        assertTokenTypes("-", MPLLexer.MINUS);
        assertTokenTypes("×", MPLLexer.TIMES);
        assertTokenTypes("÷", MPLLexer.DIV);
        assertTokenTypes("∗", MPLLexer.AST);
        assertTokenTypes("∘", MPLLexer.COMPOSE);
        
        // Comparison
        assertTokenTypes("=", MPLLexer.EQ);
        assertTokenTypes("≠", MPLLexer.NEQ);
        assertTokenTypes("<", MPLLexer.LT);
        assertTokenTypes(">", MPLLexer.GT);
        assertTokenTypes("≤", MPLLexer.LEQ);
        assertTokenTypes("≥", MPLLexer.GEQ);
        assertTokenTypes("≈", MPLLexer.APPROX);
        assertTokenTypes("∼", MPLLexer.SIM);
        
        // Logic
        assertTokenTypes("∧", MPLLexer.AND);
        assertTokenTypes("∨", MPLLexer.OR);
        assertTokenTypes("⟹", MPLLexer.IMPLIES);
        
        // Assignment
        assertTokenTypes("←", MPLLexer.LEFTARROW);
        assertTokenTypes("≜", MPLLexer.DEFINITION);
    }
    
    @Test
    public void testEffectOperators() throws IOException {
        assertTokenTypes("↯", MPLLexer.RAISE);
        assertTokenTypes("↴", MPLLexer.HANDLE);
        assertTokenTypes("‖", MPLLexer.PARALLEL);
        assertTokenTypes("⊕", MPLLexer.ALLOC);
        assertTokenTypes("⊖", MPLLexer.RELEASE);
        assertTokenTypes("✎", MPLLexer.TRACE);
        assertTokenTypes("⏲", MPLLexer.DELAY);
        assertTokenTypes("⟳", MPLLexer.PERIODIC);
    }
    
    @Test
    public void testDelimiters() throws IOException {
        assertTokenTypes("(", MPLLexer.LPAREN);
        assertTokenTypes(")", MPLLexer.RPAREN);
        assertTokenTypes("[", MPLLexer.LBRACK);
        assertTokenTypes("]", MPLLexer.RBRACK);
        assertTokenTypes("{", MPLLexer.LBRACE);
        assertTokenTypes("}", MPLLexer.RBRACE);
        assertTokenTypes("⟨", MPLLexer.LANGLE);
        assertTokenTypes("⟩", MPLLexer.RANGLE);
        assertTokenTypes("⌈", MPLLexer.LCEIL);
        assertTokenTypes("⌉", MPLLexer.RCEIL);
        assertTokenTypes("〔", MPLLexer.LRAII);
        assertTokenTypes("〕", MPLLexer.RRAII);
    }
    
    @Test
    public void testNumbers() throws IOException {
        assertTokenTypes("123", MPLLexer.NUMBER);
        assertTokenTypes("3.14", MPLLexer.NUMBER);
        assertTokenTypes("1.23e10", MPLLexer.NUMBER);
        assertTokenTypes("0x1A2B", MPLLexer.NUMBER);
        assertTokenTypes("0b1101", MPLLexer.NUMBER);
    }
    
    @Test
    public void testStrings() throws IOException {
        assertTokenTypes("\"hello\"", MPLLexer.STRING);
        assertTokenTypes("\"hello\\nworld\"", MPLLexer.STRING);
        assertTokenTypes("\"\\\"quoted\\\"\"", MPLLexer.STRING);
        assertTokenTypes("\"\"\"raw\nstring\"\"\"", MPLLexer.RAWSTRING);
    }
    
    @Test
    public void testIdentifiers() throws IOException {
        assertTokenTypes("foo", MPLLexer.IDENTIFIER);
        assertTokenTypes("_bar", MPLLexer.IDENTIFIER);
        assertTokenTypes("baz123", MPLLexer.IDENTIFIER);
        assertTokenTypes("camelCase", MPLLexer.IDENTIFIER);
    }
    
    @Test
    public void testComments() throws IOException {
        // Comments should be skipped
        assertTokenTypes("-- comment\n123", MPLLexer.NUMBER);
        assertTokenTypes("{- multi\nline -} 456", MPLLexer.NUMBER);
        assertTokenTypes("{- nested {- comment -} -} 789", MPLLexer.NUMBER);
    }
    
    @Test
    public void testPathLiterals() throws IOException {
        assertTokenTypes("🖫 \"path\"", MPLLexer.PATH, MPLLexer.STRING);
        assertTokenTypes("\\path \"path\"", MPLLexer.PATH, MPLLexer.STRING);
    }
    
    @Test
    public void testComplexTokenSequences() throws IOException {
        assertTokenTypes("λx∈ℕ: x+1",
            MPLLexer.LAMBDA_VAR, MPLLexer.IDENTIFIER, MPLLexer.IN,
            MPLLexer.NAT, MPLLexer.COLON, MPLLexer.IDENTIFIER,
            MPLLexer.PLUS, MPLLexer.NUMBER);
        
        assertTokenTypes("∀n∈ℕ: n≥0",
            MPLLexer.FORALL, MPLLexer.IDENTIFIER, MPLLexer.IN,
            MPLLexer.NAT, MPLLexer.COLON, MPLLexer.IDENTIFIER,
            MPLLexer.GEQ, MPLLexer.NUMBER);
    }
}