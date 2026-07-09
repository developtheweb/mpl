package com.mpl.test;

import org.junit.Assert;
import org.junit.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Documentation-consistency test: every fenced ```mpl code block in the
 * project documentation must parse with the shipped grammar. This keeps the
 * docs and the grammar from describing different languages.
 */
public class DocumentationTest extends MPLTestBase {

    private static final Pattern MPL_BLOCK =
        Pattern.compile("```mpl\\R(.*?)```", Pattern.DOTALL);

    @Test
    public void testReadmeCodeBlocksParse() throws IOException {
        assertAllMplBlocksParse(Paths.get("README.md"));
    }

    private void assertAllMplBlocksParse(Path doc) throws IOException {
        String content = Files.readString(doc);
        Matcher m = MPL_BLOCK.matcher(content);
        int count = 0;
        while (m.find()) {
            count++;
            String code = m.group(1);
            ParseResult result = parseWithDiagnostics(code);
            if (!result.errors.isEmpty()) {
                Assert.fail(doc + " ```mpl block #" + count + " does not parse:\n"
                    + code + "\nErrors:\n" + String.join("\n", result.errors));
            }
        }
        Assert.assertTrue("No ```mpl blocks found in " + doc, count > 0);
    }
}
