# 💬 React Native Chat App

[![GitHub](https://img.shields.io/badge/GitHub-reactnative__chatapp-blue?logo=github)](https://github.com/mohammadfirmansyah/reactnative_chatapp)
[![React Native](https://img.shields.io/badge/React%20Native-0.74.5-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51.0.38-000020?logo=expo)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A modern, feature-rich real-time chat application built with React Native, Expo, and Firebase. This app demonstrates best practices in mobile development with comprehensive dark mode support, real-time messaging, and professional UI/UX design.

## ✨ Key Features

- **Real-time Messaging**: Instant message delivery using Firebase Firestore with live updates
- **User Authentication**: Secure email/password authentication via Firebase Auth
- **Dark Mode Support**: Complete theme system with seamless light/dark mode switching
- **Profile Customization**: Upload and manage profile pictures with Firebase Storage
- **Personal Notes**: Chat with yourself for private notes and reminders
- **Modern UI/UX**: Clean, intuitive interface with smooth animations and responsive design
- **Message Timestamps**: 24-hour format timestamps for all messages
- **Avatar System**: Custom profile pictures for all users
- **Tab Navigation**: Easy navigation between Buddies, Chat, and Settings
- **Responsive Design**: Adaptive layout that works on various screen sizes

## 🛠️ Technologies Used

- **React Native** - v0.74.5 - Cross-platform mobile framework
- **Expo SDK** - v51.0.38 - Development and build toolchain
- **Firebase Firestore** - Real-time database for messages
- **Firebase Authentication** - User authentication system
- **Firebase Storage** - Profile picture storage
- **React Navigation** - v6.x - Tab and stack navigation
- **GiftedChat** - v2.6.4 - Chat UI components
- **AsyncStorage** - Theme persistence
- **Expo Image Picker** - Profile picture selection

## 📂 Project Structure

```
reactnative_chatapp/
├── App.js                          # Main app entry with navigation
├── ChatScreen.js                   # Chat interface with real-time messaging
├── ListUsers.js                    # User list (Buddies screen)
├── LoginScreen.js                  # User login
├── SignUpScreen.js                 # User registration
├── SettingsScreen_withstorage.js   # Settings with avatar upload
├── ThemeContext.js                 # Global theme management (dark/light mode)
├── firebase.js                     # Firebase configuration
├── useAuthentication.js            # Custom auth hook
├── colors.js                       # Legacy color constants
├── assets/                         # Images and fonts
├── app.json                        # Expo configuration
└── package.json                    # Dependencies
```

## 🚀 Setup & Installation

### Prerequisites

Make sure you have the following installed:
- **Node.js** >= 18.0
- **npm** or **yarn**
- **Expo CLI** (will be installed with project dependencies)
- **Expo Go app** (for testing on physical device)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammadfirmansyah/reactnative_chatapp.git
   cd reactnative_chatapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Enable Firebase Storage
   - Copy your Firebase config to `firebase.js`

4. **Update Firebase Configuration:**
   ```javascript
   // firebase.js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

## 💻 Usage / How to Run

### Development Mode

1. **Start the Expo development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

2. **Run on device/emulator:**
   - **Android**: Press `a` or scan QR code with Expo Go
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Web**: Press `w` to open in browser

3. **Clear cache (if needed):**
   ```bash
   npx expo start --clear
   ```

### Production Build

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

## 📝 Important Code Explanations

### Theme System (Dark/Light Mode)

The app uses React Context for global theme management:

```javascript
// ThemeContext.js - Theme switching logic
export const lightTheme = {
  primary: '#F97316',          // Orange brand color
  background: '#F8F9FA',       // Light background
  text: '#1F2937',             // Dark text
  messageYou: '#F97316',       // Sent message bubble
  messageOther: '#ffffff',     // Received message bubble
  isDark: false
};

export const darkTheme = {
  primary: '#FB923C',          // Lighter orange for visibility
  background: '#111827',       // Dark background
  text: '#F9FAFB',             // Light text
  messageYou: '#EA580C',       // Dark orange bubble
  messageOther: '#374151',     // Dark gray bubble
  isDark: true
};
```

**Key Feature**: The `key` prop on GiftedChat forces re-render when theme changes:
```javascript
<GiftedChat
  key={theme.isDark ? 'dark' : 'light'}  // Force re-render on theme toggle
  // ... other props
/>
```

### Real-time Messaging

Messages are synced in real-time using Firestore listeners:

```javascript
// ChatScreen.js - Real-time message listener
useEffect(() => {
  const collectionRef = collection(db, 'chats');
  const q = query(collectionRef, orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, snapshot => {
    setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user
      }))
    );
  });
  
  return unsubscribe; // Cleanup on unmount
}, []);
```

### Responsive Bubble Width

Prevents text overflow by calculating maximum bubble width:

```javascript
// Calculate 80% of screen width minus margins
const screenWidth = Dimensions.get('window').width;
const maxBubbleWidth = screenWidth * 0.8 - 16;

// Apply to bubble container
<View style={{
  maxWidth: maxBubbleWidth,  // Absolute pixel value
  // ...
}}>
  <Text style={{ 
    flexWrap: 'wrap',        // Enable text wrapping
    width: '100%'            // Force wrap within container
  }}>
    {message.text}
  </Text>
</View>
```

### Profile Picture Upload

Users can upload avatars to Firebase Storage:

```javascript
// SettingsScreen_withstorage.js
const uploadImage = async (uri) => {
  // Convert image to blob
  const response = await fetch(uri);
  const blob = await response.blob();
  
  // Upload to Firebase Storage
  const storageRef = ref(storage, `profile_pics/${new Date().getTime()}.jpg`);
  await uploadBytes(storageRef, blob);
  
  // Get public URL
  const url = await getDownloadURL(storageRef);
  return url;
};
```

## 📖 Learning Outcomes

This project demonstrates:

- ✅ **Real-time Database Operations**: Firestore listeners and queries
- ✅ **State Management**: React Context API for global theme state
- ✅ **Authentication Flow**: Firebase Auth with email/password
- ✅ **File Upload**: Firebase Storage integration for images
- ✅ **React Navigation**: Tab and stack navigator patterns
- ✅ **Custom Hooks**: `useAuthentication` for auth state management
- ✅ **Theme Persistence**: AsyncStorage for user preferences
- ✅ **Responsive Design**: Dimensions API for adaptive layouts
- ✅ **Component Lifecycle**: useEffect, useFocusEffect, useCallback
- ✅ **Error Handling**: Try-catch blocks and user-friendly error messages

## 🎨 UI/UX Features

### Dark Mode
- Automatic color scheme switching
- Persistent theme preference
- All components adapt seamlessly
- Tab bar follows theme

### Chat Interface
- Orange bubbles for sent messages
- White/gray bubbles for received messages
- 24-hour timestamp format
- Avatar display for all users
- Message input with theme-aware styling
- Smooth scrolling and animations

### Navigation
- Bottom tab navigation (Buddies, Chat, Settings)
- Orange active tab indicator
- Custom icons for each tab
- Responsive tab bar height (60px)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

- **Mohammad Firman Syah**
- **GitHub**: [@mohammadfirmansyah](https://github.com/mohammadfirmansyah)
- **Project Link**: [https://github.com/mohammadfirmansyah/reactnative_chatapp](https://github.com/mohammadfirmansyah/reactnative_chatapp)

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Development platform
- [Firebase](https://firebase.google.com/) - Backend services
- [GiftedChat](https://github.com/FaridSafi/react-native-gifted-chat) - Chat UI library
- [React Navigation](https://reactnavigation.org/) - Navigation library

---

**Note**: For production deployment, ensure you:
- Set up proper Firebase security rules
- Configure environment variables for sensitive data
- Enable Firebase App Check for additional security
- Implement proper error logging and analytics
- Test thoroughly on both iOS and Android devices

Built with ❤️ using React Native & Firebase
