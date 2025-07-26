package com.mpl.test;

import com.mpl.parser.*;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;
import org.junit.Assert;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;

public class MPLTestBase {
    
    /**
     * Parse MPL code and return the parse tree
     */
    protected ParseTree parse(String input) throws IOException {
        return parseWithErrors(input, false);
    }
    
    /**
     * Parse MPL code and collect any syntax errors
     */
    protected ParseResult parseWithDiagnostics(String input) throws IOException {
        List<String> errors = new ArrayList<>();
        ParseTree tree = parseWithErrors(input, true, errors);
        return new ParseResult(tree, errors);
    }
    
    private ParseTree parseWithErrors(String input, boolean collectErrors) throws IOException {
        return parseWithErrors(input, collectErrors, null);
    }
    
    private ParseTree parseWithErrors(String input, boolean collectErrors, List<String> errorList) throws IOException {
        ANTLRInputStream inputStream = new ANTLRInputStream(input);
        MPLLexer lexer = new MPLLexer(inputStream);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        MPLParser parser = new MPLParser(tokens);
        
        if (collectErrors && errorList != null) {
            parser.removeErrorListeners();
            parser.addErrorListener(new BaseErrorListener() {
                @Override
                public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol,
                                      int line, int charPositionInLine, String msg,
                                      RecognitionException e) {
                    errorList.add(String.format("line %d:%d %s", line, charPositionInLine, msg));
                }
            });
        }
        
        return parser.program();
    }
    
    /**
     * Parse a file and return the parse tree
     */
    protected ParseTree parseFile(String filename) throws IOException {
        String content = Files.readString(Paths.get(filename));
        return parse(content);
    }
    
    /**
     * Assert that code parses without errors
     */
    protected void assertParses(String input) throws IOException {
        ParseResult result = parseWithDiagnostics(input);
        if (!result.errors.isEmpty()) {
            Assert.fail("Parse errors: " + String.join("\n", result.errors));
        }
    }
    
    /**
     * Assert that code does not parse (contains syntax errors)
     */
    protected void assertDoesNotParse(String input) throws IOException {
        ParseResult result = parseWithDiagnostics(input);
        Assert.assertFalse("Expected parse errors but got none", result.errors.isEmpty());
    }
    
    /**
     * Get all tokens from input
     */
    protected List<Token> tokenize(String input) throws IOException {
        ANTLRInputStream inputStream = new ANTLRInputStream(input);
        MPLLexer lexer = new MPLLexer(inputStream);
        List<Token> tokens = new ArrayList<>();
        
        Token token;
        while ((token = lexer.nextToken()).getType() != Token.EOF) {
            tokens.add(token);
        }
        
        return tokens;
    }
    
    /**
     * Assert that input tokenizes to expected token types
     */
    protected void assertTokenTypes(String input, int... expectedTypes) throws IOException {
        List<Token> tokens = tokenize(input);
        Assert.assertEquals("Wrong number of tokens", expectedTypes.length, tokens.size());
        
        for (int i = 0; i < expectedTypes.length; i++) {
            Assert.assertEquals("Wrong token type at position " + i,
                              expectedTypes[i], tokens.get(i).getType());
        }
    }
    
    protected static class ParseResult {
        public final ParseTree tree;
        public final List<String> errors;
        
        public ParseResult(ParseTree tree, List<String> errors) {
            this.tree = tree;
            this.errors = errors;
        }
    }
}