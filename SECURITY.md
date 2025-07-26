# Security Policy

## Supported Versions

MPL is currently in active development. Security updates are provided for:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

The MPL team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities via email to:
- **Primary**: developtheweb@protonmail.com
- **Subject Line**: [SECURITY] MPL Vulnerability Report

### What to Include

Please provide:
1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if you have one)
5. **Your contact information** (for follow-up questions)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days for critical issues

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your report
2. **Assessment**: We'll investigate and determine the severity
3. **Updates**: We'll keep you informed of our progress
4. **Credit**: With your permission, we'll acknowledge your contribution when the issue is resolved

## Security Considerations for MPL

Given MPL's unique nature as a mathematical programming language, please consider these security aspects:

### 1. Unicode Handling
- Homograph attacks using similar-looking Unicode characters
- Bidirectional text manipulation
- Unicode normalization issues

### 2. Parser Security
- Grammar ambiguities that could lead to unexpected behavior
- Resource exhaustion through complex expressions
- Injection attacks through mathematical notation

### 3. Educational Environment
- MPL is designed for educational use, including by children
- Consider the impact on learning environments
- Be mindful of accessibility features

### 4. Multi-Modal Input
- Voice input security considerations
- Visual palette tampering
- Handwriting recognition exploits

## Responsible Disclosure

We support responsible disclosure:
1. Give us reasonable time to address the issue before public disclosure
2. Avoid accessing or modifying other users' data
3. Don't perform actions that could harm the service or its users
4. Act in good faith to avoid privacy violations

## Security Best Practices for Contributors

When contributing to MPL:

1. **Input Validation**: Always validate and sanitize user input
2. **Error Handling**: Never expose internal system details in error messages
3. **Dependencies**: Keep all dependencies up to date
4. **Code Review**: All security-related changes require thorough review
5. **Testing**: Include security test cases for new features

## Contact

- **Security Issues**: developtheweb@protonmail.com
- **General Questions**: See [SUPPORT.md](SUPPORT.md)
- **Project Maintainer**: Reverend Steven Milanese (@developtheweb)

---

Thank you for helping keep MPL and its community safe!