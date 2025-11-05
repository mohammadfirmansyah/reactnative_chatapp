# Contributing to React Native Chat App

First off, thank you for considering contributing to React Native Chat App! It's people like you that make this project such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive experience for everyone. Please be respectful and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - Device: [e.g. iPhone 14, Samsung Galaxy S23]
 - OS: [e.g. iOS 17.0, Android 14]
 - App Version: [e.g. 1.0.0]
 - Expo Version: [e.g. 51.0.38]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit your changes** following commit message guidelines
6. **Push to your fork** and submit a pull request

**Pull Request Template:**

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

- [ ] Test A
- [ ] Test B

## Checklist
- [ ] My code follows the coding guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on both iOS and Android (if applicable)
```

## Development Setup

### Prerequisites

- Node.js >= 18.0
- npm or yarn
- Expo CLI
- Git

### Setup Steps

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/reactnative_chatapp.git
   cd reactnative_chatapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create your own Firebase project
   - Configure authentication, Firestore, and Storage
   - Update `firebase.js` with your credentials

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Coding Guidelines

### Code Style

- **Use meaningful variable names** that describe their purpose
- **Add comments** to explain complex logic, especially in English
- **Follow React best practices** (hooks, functional components)
- **Keep components small** and focused on a single responsibility
- **Use consistent formatting** (the project uses standard React Native conventions)

### Component Structure

```javascript
// Import statements
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Component definition with clear documentation
/**
 * ComponentName - Brief description of what it does
 * @param {Object} props - Component props
 */
export default function ComponentName({ prop1, prop2 }) {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <View>
      {/* JSX content */}
    </View>
  );
}
```

### File Naming

- **Components**: PascalCase (e.g., `ChatScreen.js`, `ListUsers.js`)
- **Utilities**: camelCase (e.g., `useAuthentication.js`, `firebase.js`)
- **Styles**: Same as component name

### Comment Guidelines

All code comments should be in **English** and follow this pattern:

```javascript
// Single-line comments: Brief explanation of what the next line does
const variable = value;

/**
 * Multi-line comments for complex logic:
 * - Explain the purpose
 * - Describe key steps
 * - Note any important considerations
 */
function complexFunction() {
  // Implementation
}
```

### Theme System

When adding new UI components, ensure they support both light and dark modes:

```javascript
import { useTheme } from './ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>
        Content that adapts to theme
      </Text>
    </View>
  );
}
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
feat(chat): add message deletion feature

- Add swipe-to-delete gesture
- Confirm dialog before deletion
- Update Firestore to remove message

Closes #123
```

```bash
fix(theme): correct bubble color on theme toggle

The sent message bubbles were not updating color when switching
from dark mode back to light mode. Added key prop to force
GiftedChat re-render on theme change.

Fixes #456
```

```bash
docs(readme): update installation instructions

- Add Firebase setup steps
- Include environment configuration
- Add troubleshooting section
```

### Branch Naming

- **Feature**: `feature/description-of-feature`
- **Bug Fix**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-changes`
- **Refactor**: `refactor/description-of-refactor`

Example:
```bash
git checkout -b feature/add-group-chat
git checkout -b fix/message-timestamp-format
git checkout -b docs/update-contributing-guide
```

## Testing Guidelines

Before submitting a pull request:

1. **Test on multiple devices:**
   - iOS (if possible)
   - Android
   - Different screen sizes

2. **Test both themes:**
   - Light mode
   - Dark mode

3. **Test edge cases:**
   - Empty states
   - Long text messages
   - Network disconnection
   - Slow connections

4. **Check for console warnings:**
   - No React warnings
   - No deprecation warnings
   - No performance warnings

## Questions?

Feel free to open an issue with the label `question` if you have any questions about contributing.

## Recognition

Contributors will be recognized in the project's README and release notes.

Thank you for contributing! 🎉
