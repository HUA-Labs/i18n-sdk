# Contributing to hua-i18n-sdk

Thank you for your interest in contributing to hua-i18n-sdk! This document provides guidelines for contributing to this project.

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/i18n-sdk.git
   cd i18n-sdk
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the project:

   ```bash
   npm run build
   ```

## Development

### Available Scripts

- `npm run build` - Build the project
- `npm run dev` - Watch mode for development
- `npm run clean` - Clean build outputs
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

### Project Structure

```text
src/
├── core/           # Core translation logic
├── hooks/          # React hooks
├── types/          # TypeScript type definitions
├── __tests__/      # Test files
└── index.ts        # Main entry point
```

## Contributing Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Add proper JSDoc comments for public APIs
- Ensure all tests pass

### Commit Messages

Follow conventional commits format:

```text
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation if needed
5. Ensure the build passes
6. Submit a pull request

### Pull Request Guidelines

- Provide a clear description of the changes
- Include any relevant issue numbers
- Add screenshots for UI changes
- Ensure all CI checks pass

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names

## Documentation

### Updating Documentation

- Update README.md for new features
- Add examples for new APIs
- Keep documentation in sync with code changes

### Translation Files

When adding new languages or translations:

1. Create translation files in the appropriate language directory
2. Follow the existing naming conventions
3. Ensure all keys are translated
4. Test with the new language

## Issues

### Reporting Bugs

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Code examples if applicable

### Feature Requests

For feature requests:

- Describe the feature clearly
- Explain the use case
- Provide examples if possible
- Consider implementation complexity

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Join our community discussions

Thank you for contributing to hua-i18n-sdk!
