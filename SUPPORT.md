# Getting Help with MPL

Thank you for using the Mathematical Programming Language! We're here to help you succeed.

## 🚀 Quick Links

- **Documentation**: [Full specification](math_prog_lang.md)
- **Examples**: [Working programs](examples/)
- **Symbol Reference**: [All symbols with ASCII escapes](glyph-escapes.md)
- **Whitepaper**: [Academic paper](whitepaper/mpl-whitepaper.md)

## ❓ Getting Support

### 1. Check Existing Resources

Before asking for help:
- 📖 Read the [README](README.md) for overview and quick start
- 🔤 Check [glyph-escapes.md](glyph-escapes.md) for symbol questions
- 💡 Review [examples](examples/) for working code patterns
- 🐛 Search [existing issues](https://github.com/developtheweb/mpl/issues) for similar problems

### 2. Community Support

#### GitHub Discussions
For general questions, ideas, and community interaction:
- Visit [GitHub Discussions](https://github.com/developtheweb/mpl/discussions)
- Categories:
  - **Q&A**: Ask and answer questions
  - **Ideas**: Suggest new features or improvements
  - **Show and Tell**: Share your MPL projects
  - **General**: Everything else

#### GitHub Issues
For bugs and feature requests:
- [Report a bug](https://github.com/developtheweb/mpl/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/developtheweb/mpl/issues/new?template=feature_request.md)

### 3. Direct Contact

For sensitive issues or private concerns:
- **Email**: developtheweb@protonmail.com
- **Maintainer**: Reverend Steven Milanese (@developtheweb)

## 🎓 Learning Resources

### For Beginners
1. Start with [01_hello_world.mpl](examples/01_hello_world.mpl)
2. Learn basic operators from the [Symbol Reference](glyph-escapes.md)
3. Progress through numbered examples in order

### For Educators
- Review the educational philosophy in our [README](README.md)
- Check the Fatima Test principle in [CONTRIBUTING.md](CONTRIBUTING.md)
- Contact us about classroom materials

### For Developers
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [Grammar file](src/main/antlr4/MPL.g4) - ANTLR 4 specification
- [Test suite](src/test/) - See how testing works

## 🐛 Reporting Issues

When reporting issues, please include:
1. **MPL version** (check releases)
2. **Operating system** and version
3. **Java version** (`java -version`)
4. **Minimal code example** that reproduces the issue
5. **Expected behavior** vs actual behavior
6. **Full error message** if applicable

### Good Bug Report Example
```
Title: ∑ operator precedence incorrect with nested expressions

Version: MPL 2.0.0
OS: Ubuntu 22.04
Java: OpenJDK 11.0.17

Code:
∑(i ∈ [1,5] : i × 2) + 3

Expected: 33 (sum is 30, plus 3)
Actual: 45 (seems to be computing ∑(i ∈ [1,5] : i × (2 + 3)))

Error: No error, just wrong result
```

## 💬 Communication Guidelines

1. **Be respectful** - We're all learning together
2. **Be patient** - MPL is a volunteer project
3. **Be clear** - Provide context and examples
4. **Be mindful** - Not everyone speaks English fluently
5. **Follow the Code of Conduct** - See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## 🌍 Language Support

While project documentation is in English, we welcome questions in any language:
- Use your native language if it helps explain your issue
- We'll use translation tools if needed
- Community members may help translate

Remember: MPL exists to break language barriers - that includes our support!

## 🔧 Common Issues

### Unicode Display Problems
- Ensure your terminal supports UTF-8
- Try ASCII escapes (e.g., `\sum` instead of ∑)
- Check font support for mathematical symbols

### Parser Errors
- Verify correct symbol usage with [glyph-escapes.md](glyph-escapes.md)
- Check operator precedence in [precedence.csv](precedence.csv)
- Ensure balanced brackets/parentheses

### Build Issues
- Requires Java 11 or higher
- Run `./gradlew clean build`
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for setup steps

---

Remember: Every question helps us improve MPL for everyone. Don't hesitate to ask!