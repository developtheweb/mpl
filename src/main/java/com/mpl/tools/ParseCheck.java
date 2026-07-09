package com.mpl.tools;

import com.mpl.parser.*;
import org.antlr.v4.runtime.*;
import java.io.IOException;
import java.nio.file.*;

/**
 * Grammar-check CLI: the stable seam over the ANTLR parser for tooling
 * (the conformance fuzzer today, the Java runtime in Stage 4).
 *
 * Arguments are file paths, or "-" for stdin. Exit 0 iff every input
 * parses; otherwise exit 1, printing "<file>:<line>:<col>: <message>"
 * for the first error of each failing input (col is 0-based, as ANTLR
 * reports it).
 */
public final class ParseCheck {

    public static void main(String[] args) throws IOException {
        if (args.length == 0) {
            System.err.println("Usage: ParseCheck <file.mpl | -> ...");
            System.exit(2);
        }
        boolean allOk = true;
        for (String arg : args) {
            String name = arg.equals("-") ? "<stdin>" : arg;
            CharStream input;
            try {
                // CharStreams works in Unicode code points; the deprecated
                // ANTLRInputStream broke on supplementary-plane glyphs.
                input = arg.equals("-")
                        ? CharStreams.fromStream(System.in)
                        : CharStreams.fromPath(Paths.get(arg));
            } catch (IOException e) {
                System.out.println(name + ":0:0: " + e.getMessage());
                allOk = false;
                continue;
            }
            String error = firstError(input);
            if (error != null) {
                System.out.println(name + ":" + error);
                allOk = false;
            }
        }
        System.exit(allOk ? 0 : 1);
    }

    /** Returns "line:col: message" for the first syntax error, or null. */
    private static String firstError(CharStream input) {
        final String[] first = {null};
        var listener = new BaseErrorListener() {
            @Override
            public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol,
                                    int line, int charPositionInLine, String msg,
                                    RecognitionException e) {
                if (first[0] == null) {
                    first[0] = line + ":" + charPositionInLine + ": " + msg;
                }
            }
        };
        MPLLexer lexer = new MPLLexer(input);
        lexer.removeErrorListeners();
        lexer.addErrorListener(listener);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        MPLParser parser = new MPLParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener(listener);
        parser.program();
        return first[0];
    }
}
