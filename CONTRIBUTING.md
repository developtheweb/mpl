# Contributing to Mathematical Programming Language (MPL)

First off, thank you for considering contributing to MPL! 🌍 

MPL exists to break down language barriers in programming education. Every contribution, no matter how small, helps us move closer to a world where any child can learn to code using the universal language of mathematics.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the [MPL Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [developtheweb@protonmail.com](mailto:developtheweb@protonmail.com).

## Project Leadership

MPL was created and is maintained by Reverend Steven Milanese (@developtheweb). All major design decisions and direction are set by the project creator.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check [existing issues](https://github.com/developtheweb/mpl/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (include MPL code snippets)
- **Describe the behavior you observed and what you expected**
- **Include system details** (OS, Java version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/developtheweb/mpl/issues). When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful** to MPL users
- **Consider the Fatima Test**: Would a 10-year-old non-English speaker understand this?

### 🔤 Adding New Symbols

When proposing new mathematical symbols:

1. **Justify the symbol choice** - Why this symbol for this operation?
2. **Check Unicode support** - Ensure the symbol is widely supported
3. **Provide ASCII escape** - Every symbol needs a fallback (e.g., `\lambda` for λ)
4. **Test precedence** - How does it interact with existing operators?
5. **Add examples** - Show real use cases

### 🌍 Translations and Localization

Help make MPL accessible in more languages:

- Translate documentation
- Create localized error messages
- Develop region-specific examples
- Write tutorials in your native language

### 📚 Improving Documentation

- Fix typos and improve clarity
- Add more examples
- Create visual guides
- Write tutorials for specific audiences
- Improve API documentation

## Development Process

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/mpl.git
   cd mpl
   ```
3. **Set up the upstream remote**:
   ```bash
   git remote add upstream https://github.com/developtheweb/mpl.git
   ```
4. **Install dependencies**:
   ```bash
   # Requires Java 11+
   ./gradlew build
   ```

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following our style guidelines
3. **Add tests** for any new functionality
4. **Run the test suite**:
   ```bash
   ./gradlew test
   ```
5. **Update documentation** as needed

### Testing Your Changes

All changes must:
- Pass existing tests
- Include new tests for new features
- Maintain or improve code coverage
- Work with all input methods (visual, voice, keyboard)

## Style Guidelines

### Code Style

- **Java Code**: Follow standard Java conventions
- **MPL Examples**: Use clear, educational examples
- **Comments**: Write in plain language, avoid jargon

### Grammar Development

When modifying `MPL.g4`:
- Maintain zero shift/reduce conflicts
- Document any precedence changes
- Test with complex expressions
- Update `precedence.csv` if needed

### Symbol Guidelines

- Prefer universally recognized mathematical symbols
- Ensure symbols have semantic meaning
- Avoid symbols that conflict with common mathematical usage
- Always provide ASCII escapes

## Commit Message Guidelines

We follow strict commit message standards (see CLAUDE.md for full details):

### The 7 Golden Rules

1. **Separate subject from body** with a blank line
2. **Limit subject to 50 characters**
3. **Capitalize the subject line**
4. **Use imperative mood** ("Add feature" not "Added feature")
5. **Wrap body at 72 characters**
6. **Explain what and why**, not how
7. **Reference issues** (e.g., "Closes #123")

### Example

```
feat: Add matrix multiplication operator

Implement the ⊗ operator for matrix multiplication following
standard mathematical notation. This enables natural expression
of linear algebra operations in MPL.

- Add parser rules for ⊗ with correct precedence
- Implement type checking for matrix dimensions
- Add comprehensive test cases
- Update symbol reference documentation

Closes #123
```

## Pull Request Process

1. **Update documentation** - README.md, examples, and relevant docs
2. **Add tests** - Ensure your changes are covered
3. **Update CHANGELOG.md** - Note your changes in the Unreleased section
4. **Pass all checks** - Tests, linting, and build must succeed
5. **Get review** - The maintainer must approve
6. **Squash commits** - Keep history clean

### PR Title Format

Use the same format as commit messages:
- `feat: Add support for complex numbers`
- `fix: Correct precedence of ∑ operator`
- `docs: Add tutorial for educators`

### The Review Process

Reviews will check:
- **Correctness**: Does it work as intended?
- **Tests**: Are changes adequately tested?
- **Documentation**: Is it well documented?
- **Cognitive Load**: Does it pass the Fatima Test?
- **Compatibility**: Does it maintain backwards compatibility?

## Community

### Getting Help

- **GitHub Issues**: [github.com/developtheweb/mpl/issues](https://github.com/developtheweb/mpl/issues)
- **Email**: developtheweb@protonmail.com

### Recognition

Contributors are recognized in:
- The AUTHORS file
- Release notes
- Commit history

### License

By contributing to MPL, you agree that your contributions will be licensed under the GNU Affero General Public License v3.0 (AGPLv3).

---

## Summary

Remember: Every contribution to MPL helps break down barriers to programming education worldwide. Whether you're fixing a typo, adding a feature, or translating documentation, you're part of a movement for cognitive justice in technology.

**Thank you for helping us make programming truly universal! 🌍✨**