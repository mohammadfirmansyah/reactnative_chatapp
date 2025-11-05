// Theme Context: Global state management for dark/light mode throughout the app
// Provides consistent color schemes and persists user preference using AsyncStorage
import React, { createContext, useState, useContext, useEffect } from 'react';
// Import AsyncStorage for persisting theme preference across app sessions
import AsyncStorage from '@react-native-async-storage/async-storage';

// Light theme configuration with orange as primary brand color
// Used during daytime or when user prefers bright interface
export const lightTheme = {
  primary: '#F97316', // Vibrant orange for buttons, highlights, and branding
  primaryLight: '#FFF7ED', // Very light orange for backgrounds and subtle accents
  primaryDark: '#EA580C', // Darker orange for hover states and emphasis
  background: '#F8F9FA', // Soft gray-white for main app background
  cardBackground: '#ffffff', // Pure white for cards and elevated surfaces
  text: '#1F2937', // Dark gray for primary text (good readability)
  textSecondary: '#6B7280', // Medium gray for secondary text and labels
  textLight: '#ffffff', // White text for dark backgrounds (buttons, headers)
  border: '#E5E7EB', // Light gray for borders and dividers
  shadow: '#F97316', // Orange shadow for elevation effects
  messageYou: '#F97316', // Orange background for sent messages
  messageOther: '#ffffff', // White background for received messages
  headerBg: '#F97316', // Orange header background
  badgeBg: '#F97316', // Orange background for "YOU" badge
  isDark: false, // Flag indicating this is light mode
};

// Dark theme configuration with adjusted orange shades for better contrast
// Used during nighttime or when user prefers dark interface
export const darkTheme = {
  primary: '#FB923C', // Slightly lighter orange for better visibility on dark backgrounds
  primaryLight: '#1F2937', // Dark blue-gray for subtle backgrounds
  primaryDark: '#F97316', // Standard orange for emphasis
  background: '#111827', // Very dark gray (almost black) for main background
  cardBackground: '#1F2937', // Slightly lighter dark gray for cards
  text: '#F9FAFB', // Off-white for primary text
  textSecondary: '#9CA3AF', // Medium gray for secondary text
  textLight: '#ffffff', // Pure white for high contrast text
  border: '#374151', // Dark gray for borders
  shadow: '#000000', // Black shadow for depth
  messageYou: '#EA580C', // Darker orange for sent messages
  messageOther: '#374151', // Dark gray for received messages
  headerBg: '#EA580C', // Dark orange for header
  badgeBg: '#FB923C', // Light orange for badges
  isDark: true, // Flag indicating this is dark mode
};

// Create React Context for theme state
// This allows any component in the app to access theme without prop drilling
const ThemeContext = createContext();

// ThemeProvider component wraps the entire app to provide theme context
// Must wrap App.js to make theme available everywhere
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Boolean flag for dark mode state
  const [theme, setTheme] = useState(lightTheme); // Current active theme object

  // Load saved theme preference when app starts
  // Ensures user's choice persists across app sessions
  useEffect(() => {
    loadTheme();
  }, []);

  // Retrieve theme preference from AsyncStorage
  // AsyncStorage provides persistent key-value storage on device
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        // Parse saved preference and apply corresponding theme
        const isDarkMode = savedTheme === 'dark';
        setIsDark(isDarkMode);
        setTheme(isDarkMode ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  // Toggle between dark and light themes
  // Called when user presses theme toggle button in Settings
  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark; // Flip the boolean state
      setIsDark(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme); // Apply new theme
      
      // Save preference to AsyncStorage for persistence
      // Will be loaded next time app opens
      await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Provide theme state and toggle function to all child components
  // Any component can access: const { theme, isDark, toggleTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing theme context in any component
// Usage: const { theme, isDark, toggleTheme } = useTheme();
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Safety check: Ensures hook is only used inside ThemeProvider
  // Prevents runtime errors from accessing context outside provider scope
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context; // Returns { theme, isDark, toggleTheme }
};
