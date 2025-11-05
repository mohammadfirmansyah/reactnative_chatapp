// Login screen for existing users to authenticate
// Provides email/password input fields and handles Firebase authentication
import React, { useState } from 'react';
// Import React Native components for UI
import { View, TextInput, Pressable, Text, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// Import Firebase authentication function for login
import { signInWithEmailAndPassword } from 'firebase/auth';
// Import navigation hook for screen transitions
import { useNavigation } from '@react-navigation/native';
// Import Firebase auth instance
import { auth } from './firebase';

const LoginScreen = () => {
  // State for storing user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Handle login button press
  // Attempts to authenticate user with Firebase
  const handleLogin = async () => {
    try {
      // Sign in with email and password
      // On success, useAuthentication hook will detect the change and show main app
      await signInWithEmailAndPassword(auth, email, password);
      console.log("The user has successfully logged in")
    } catch(error) {
        // Handle authentication errors (wrong password, user not found, etc.)
        const errorMessage = error.message;
        console.log(errorMessage);
        Alert.alert("Login Error", "Please check the credentials");
    };
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* App logo displayed at the top */}
          <Image 
            source={require('./assets/logo.png')}
            style={styles.logo}
          />

          {/* Screen title */}
          <Text style={styles.header}>Log In</Text>

          {/* Email input field with appropriate keyboard type */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" // Shows email-optimized keyboard
            autoCapitalize="none" // Prevents automatic capitalization of email
          />

          {/* Password input field with hidden text */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Hides password characters for security
          />

          {/* Login button */}
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>

          {/* Link to sign up screen for new users */}
          <View style={styles.signupLinkContainer}>
            <Text>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',  
    backgroundColor: '#a1eda4'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width:'80%',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default LoginScreen;
