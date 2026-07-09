# MPL Whitepaper

This directory contains the comprehensive academic whitepaper for the Mathematical Programming Language (MPL).

## Contents

### Main Documents

1. **`mpl-whitepaper.md`** (~15 pages)
   - Complete academic whitepaper in Markdown format
   - Suitable for online viewing and conversion to other formats
   - Includes all sections from Abstract through Conclusion
   - Features application sketches in 5 domains:
     - Scientific Computing
     - Data Processing
     - Web Services
     - Machine Learning
     - Systems Programming

2. **`mpl-whitepaper.tex`** 
   - Conference-ready LaTeX version (IEEE format)
   - Properly formatted for POPL/OOPSLA submission
   - Includes Unicode math support
   - Custom MPL syntax highlighting

3. **`mpl-whitepaper-appendices.md`**
   - Comprehensive appendices with:
     - Symbol reference (pointing to the authoritative glyph-escapes.md)
     - Annotated example programs
     - Grammar validation details
     - Implementation details
     - Pedagogy and envisioned pilot materials

## Whitepaper Structure

1. **Abstract** - Problem, solution, and impact summary
2. **Introduction** - Cultural barriers and research questions
3. **Related Work** - APL, Unicode languages, cognitive design
4. **Design Principles** - Universality, expressiveness, practicality
5. **Language Design** - Core operators and effect extensions
6. **Implementation** - ANTLR grammar and parser details
7. **Evaluation** - Completeness, performance, accessibility
8. **Case Studies** - Concurrency, resources, metaprogramming
9. **Real-World Applications** - Scientific, data, web, ML, systems
10. **Limitations & Future Work** - Current gaps and research directions
11. **Conclusion** - Vision for universal programming

## Key Features Documented

- **70+ Mathematical Symbols**: Unicode operators, each with exactly one ASCII escape
- **Effect Operators**: Novel symbols for exceptions, concurrency, resources
- **24 Greek Variables**: Full Greek alphabet for identifiers
- **CI-Validated Grammar**: Compiles with zero ANTLR errors and warnings; documented precedence
- **Paradigm Coverage**: Functional, imperative, concurrent, metaprogramming

## Building the LaTeX Version

```bash
# Requires XeLaTeX for Unicode support
xelatex mpl-whitepaper.tex
bibtex mpl-whitepaper
xelatex mpl-whitepaper.tex
xelatex mpl-whitepaper.tex
```

### LaTeX Requirements

- **XeLaTeX**: Required for Unicode support (not pdflatex)
- **unicode-math package**: For mathematical symbols
- **fontspec package**: For font configuration
- **newunicodechar package**: For symbol fallbacks

The LaTeX version includes fallback definitions for all MPL-specific Unicode symbols to ensure compatibility across different LaTeX installations. If symbols still don't render properly, check that Latin Modern Math font is installed.

## Target Venues

- POPL (Principles of Programming Languages)
- OOPSLA (Object-Oriented Programming, Systems, Languages & Applications)
- PLDI (Programming Language Design and Implementation)
- Onward! (New ideas in programming)

## Citation

When referencing this work:

```bibtex
@article{mpl2025,
  title={Mathematical Programming Languages: Achieving Cognitive Universality Through Unicode-Based Syntax},
  author={[Author Name]},
  journal={Preprint},
  year={2025}
}
```