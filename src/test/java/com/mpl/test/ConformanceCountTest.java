package com.mpl.test;

import org.junit.Test;
import static org.junit.Assert.*;
import java.nio.file.*;
import java.util.regex.*;

/**
 * The README's stated conformance-test count must equal the number of
 * corpus entries, so the public claim can never silently rot: adding or
 * removing an entry without updating the README fails CI (Stage 3, A8).
 */
public class ConformanceCountTest {

    @Test
    public void readmeCountMatchesCorpus() throws Exception {
        String readme = Files.readString(Paths.get("README.md"));
        long dirs;
        try (var stream = Files.list(Paths.get("conformance/corpus"))) {
            dirs = stream.filter(Files::isDirectory).count();
        }
        Matcher m = Pattern.compile("(\\d+) ratified conformance tests").matcher(readme);
        int mentions = 0;
        while (m.find()) {
            mentions++;
            assertEquals("README claims " + m.group(1)
                    + " ratified conformance tests, but conformance/corpus has " + dirs,
                    dirs, Long.parseLong(m.group(1)));
        }
        assertTrue("README must state the ratified conformance test count", mentions >= 1);
    }
}
