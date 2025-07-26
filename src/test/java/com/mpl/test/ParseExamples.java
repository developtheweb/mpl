package com.mpl.test;

import com.mpl.parser.*;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.stream.Stream;

/**
 * Standalone program to parse all example files and report results
 */
public class ParseExamples {
    
    public static void main(String[] args) throws IOException {
        if (args.length < 1) {
            System.err.println("Usage: ParseExamples <examples-directory>");
            System.exit(1);
        }
        
        Path examplesDir = Paths.get(args[0]);
        if (!Files.isDirectory(examplesDir)) {
            System.err.println("Not a directory: " + examplesDir);
            System.exit(1);
        }
        
        System.out.println("Parsing examples in: " + examplesDir.toAbsolutePath());
        System.out.println();
        
        int passed = 0;
        int failed = 0;
        
        try (Stream<Path> paths = Files.walk(examplesDir)) {
            var files = paths.filter(Files::isRegularFile)
                            .filter(p -> p.toString().endsWith(".mpl"))
                            .sorted()
                            .toList();
            
            for (Path file : files) {
                System.out.print(file.getFileName() + " ... ");
                
                try {
                    parseFile(file);
                    System.out.println("✓ PASS");
                    passed++;
                } catch (Exception e) {
                    System.out.println("✗ FAIL: " + e.getMessage());
                    failed++;
                }
            }
        }
        
        System.out.println();
        System.out.println("Results: " + passed + " passed, " + failed + " failed");
        
        if (failed > 0) {
            System.exit(1);
        }
    }
    
    private static void parseFile(Path file) throws IOException {
        String content = Files.readString(file);
        
        ANTLRInputStream input = new ANTLRInputStream(content);
        MPLLexer lexer = new MPLLexer(input);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        MPLParser parser = new MPLParser(tokens);
        
        // Collect errors
        parser.removeErrorListeners();
        var errorListener = new BaseErrorListener() {
            @Override
            public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol,
                                  int line, int charPositionInLine, String msg,
                                  RecognitionException e) {
                throw new RuntimeException(String.format("line %d:%d %s", line, charPositionInLine, msg));
            }
        };
        parser.addErrorListener(errorListener);
        
        // Parse
        parser.program();
    }
}