package com.mpl.test;

import org.junit.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

/**
 * Test that all example files parse correctly
 */
public class ExampleTest extends MPLTestBase {
    
    @Test
    public void testAllExamples() throws IOException {
        Path examplesDir = Paths.get("examples");
        
        try (Stream<Path> paths = Files.walk(examplesDir)) {
            paths.filter(Files::isRegularFile)
                 .filter(p -> p.toString().endsWith(".mpl"))
                 .forEach(this::testExampleFile);
        }
    }
    
    private void testExampleFile(Path file) {
        try {
            System.out.println("Testing: " + file);
            String content = Files.readString(file);
            assertParses(content);
            System.out.println("  ✓ Parsed successfully");
        } catch (Exception e) {
            throw new AssertionError("Failed to parse " + file + ": " + e.getMessage(), e);
        }
    }
    
    @Test
    public void test01HelloWorld() throws IOException {
        testSpecificExample("01_hello_world.mpl");
    }
    
    @Test
    public void test02Factorial() throws IOException {
        testSpecificExample("02_factorial.mpl");
    }
    
    @Test
    public void test03FileProcessing() throws IOException {
        testSpecificExample("03_file_processing.mpl");
    }
    
    @Test
    public void test04ConcurrentDownload() throws IOException {
        testSpecificExample("04_concurrent_download.mpl");
    }
    
    @Test
    public void test05ModuleDefinition() throws IOException {
        testSpecificExample("05_module_definition.mpl");
    }
    
    @Test
    public void test06ResourceManagement() throws IOException {
        testSpecificExample("06_resource_management.mpl");
    }
    
    @Test
    public void test07Metaprogramming() throws IOException {
        testSpecificExample("07_metaprogramming.mpl");
    }
    
    @Test
    public void test08RealtimeSystem() throws IOException {
        testSpecificExample("08_realtime_system.mpl");
    }
    
    @Test
    public void test09NetworkServer() throws IOException {
        testSpecificExample("09_network_server.mpl");
    }
    
    @Test
    public void test10TypeSafeDatabase() throws IOException {
        testSpecificExample("10_type_safe_database.mpl");
    }
    
    private void testSpecificExample(String filename) throws IOException {
        Path file = Paths.get("examples", filename);
        String content = Files.readString(file);
        assertParses(content);
    }
}