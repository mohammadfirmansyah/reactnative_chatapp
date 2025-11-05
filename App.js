// Main application entry point for React Native Chat App
// Manages navigation structure and authentication flow
import React from 'react';
// Import React Navigation containers and navigators
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import application screens
import ChatScreen from './ChatScreen';
import { ListUsers } from './ListUsers';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import SettingsScreen from './SettingsScreen_withstorage';
// Import custom authentication hook
import useAuthentication from './useAuthentication';
// Import icon library for tab bar icons
import { Ionicons } from '@expo/vector-icons';
// Import theme provider and hook for dark/light mode support
import { ThemeProvider, useTheme } from './ThemeContext';
// Import Toast for global notifications
import Toast from 'react-native-toast-message';

// Create navigator instances
const Stack = createStackNavigator(); // For auth screens (SignUp, Login)
const Tab = createBottomTabNavigator(); // For main app tabs (Buddies, Chat, Settings)

// Navigation component that uses theme context
// Separated from App to access ThemeProvider's context
function AppNavigation() {
  const {user} = useAuthentication(); // Get current authenticated user
  const { theme } = useTheme(); // Access current theme (light/dark mode)

  return (
    <>
      {/* Conditional rendering based on authentication state */}
      {user ? (
        // Authenticated users see the main app with bottom tab navigation
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              // Custom icon renderer for each tab
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                // Select appropriate icon based on tab name and focus state
                if (route.name === 'ChatScreen') {
                  iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'ListUsers') {
                  iconName = focused ? 'people' : 'people-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              // Orange color for active tab (brand consistency)
              tabBarActiveTintColor: '#F97316',
              tabBarInactiveTintColor: theme.textSecondary, // Adapts to theme
              // Enhanced tab bar styling that adapts to dark/light mode
              tabBarStyle: {
                height: 60, // Increased height for better touch targets
                paddingBottom: 8, // Space from bottom edge
                paddingTop: 8, // Space from top edge
                borderTopWidth: 1, // Subtle top border
                borderTopColor: theme.border, // Theme-aware border color
                backgroundColor: theme.cardBackground, // Adapts to dark/light mode
                elevation: 8, // Android shadow for depth
                shadowColor: theme.shadow, // Theme-aware shadow
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              tabBarLabelStyle: {
                fontSize: 12, // Readable label size
                fontWeight: '600', // Semi-bold for emphasis
                marginTop: 4, // Space between icon and label
              },
              tabBarIconStyle: {
                marginTop: 4, // Vertical centering
              },
            })}
          >
            {/* Three main tabs: Buddies list, Chat screen, and Settings */}
            <Tab.Screen name="ListUsers" component={ListUsers} options={{ title: 'Buddies', headerShown: false }} />
            <Tab.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat', headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings', headerShown: false }} />
          </Tab.Navigator>
          {/* Toast component for displaying notifications */}
          <Toast />
        </NavigationContainer>
      ) : (
        // Unauthenticated users see authentication screens (SignUp/Login)
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>  
      )}
    </>
  );
}

// Main App component wrapper with ThemeProvider
// This structure allows AppNavigation to access theme context
export default function App() {
  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  );
}

