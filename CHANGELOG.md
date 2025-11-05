# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Group chat functionality
- Message reactions (emoji)
- Voice message support
- Image sharing in chat
- User typing indicators
- Message read receipts
- Push notifications
- User online/offline status

## [1.0.0] - 2025-11-05

### Added
- Initial release of React Native Chat App
- Real-time messaging with Firebase Firestore
- User authentication (email/password) with Firebase Auth
- Profile picture upload to Firebase Storage
- Complete dark mode support with theme persistence
- Custom chat UI with GiftedChat library
- Tab navigation (Buddies, Chat, Settings)
- Avatar system for all users
- Personal notes (chat with yourself)
- 24-hour format timestamps
- Responsive design for various screen sizes
- Theme-aware tab bar navigation
- Comprehensive English code comments throughout

### Features
- **Authentication**
  - Email/password login
  - User registration with validation
  - Persistent authentication state
  - Secure logout functionality

- **Messaging**
  - Real-time message sync via Firestore
  - Send and receive text messages
  - Message timestamps in 24-hour format
  - Chat history persistence
  - Message bubbles with distinct styling for sent/received
  - Personal notes mode (chat with yourself)

- **Profile Management**
  - Upload profile pictures from device gallery
  - Store avatars in Firebase Storage
  - Display avatars in chat and user list
  - Update profile picture anytime

- **Theme System**
  - Light and dark mode support
  - Seamless theme switching
  - Theme persistence with AsyncStorage
  - All components adapt to theme
  - Custom color scheme with orange brand color

- **UI/UX**
  - Modern, clean interface
  - Smooth animations and transitions
  - Responsive bubble width (prevents text overflow)
  - Elegant tab bar (60px height)
  - Theme-aware input toolbar
  - Custom send button with orange branding

### Technical Implementation
- React Native 0.74.5
- Expo SDK 51.0.38
- Firebase v10.14.1 (Firestore, Auth, Storage)
- React Navigation v6.x
- GiftedChat v2.6.4
- AsyncStorage for local persistence
- Expo Image Picker for photo selection
- React Context API for theme management

### Fixed
- Chat input toolbar visibility in dark mode
- Bubble text overflow for long messages
- Theme toggle bug where sent message bubbles retain old color
- Tab bar not adapting to dark mode
- Avatar edit button UX improvement

### Developer Experience
- Comprehensive code comments in English
- Tutorial-style explanations for complex logic
- Clear project structure
- Well-documented setup process
- Contributing guidelines
- Apache 2.0 license

## Release Notes

### v1.0.0 - Initial Release

This is the first stable release of React Native Chat App. The application provides a solid foundation for real-time messaging with modern features and excellent user experience.

**Key Highlights:**
- Production-ready chat functionality
- Complete dark mode implementation
- Firebase backend integration
- Professional UI/UX design
- Comprehensive documentation

**What's Working:**
- ✅ Real-time messaging
- ✅ User authentication
- ✅ Profile customization
- ✅ Theme switching
- ✅ Responsive design
- ✅ Cross-platform (iOS, Android, Web)

**Known Limitations:**
- Single chat conversations only (no group chat yet)
- Text messages only (no images/files yet)
- No typing indicators
- No read receipts
- No push notifications

**Future Roadmap:**
See [Unreleased] section for planned features in upcoming releases.

---

## Version History

### Semantic Versioning Guide

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): Add functionality (backwards-compatible)
- **PATCH** version (0.0.X): Bug fixes (backwards-compatible)

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `chore`: Build/tooling changes

---

For detailed information about each change, see the [commit history](https://github.com/mohammadfirmansyah/reactnative_chatapp/commits/main).
