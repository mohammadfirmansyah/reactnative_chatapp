// Sign up screen for new users to create an account
// Handles user registration with email/password through Firebase Authentication
import React, { useState } from 'react';
// Import React Native components for UI
import { View, TextInput, Image, Pressable, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// Import Firebase authentication function for creating new users
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Import navigation hook for screen transitions
import { useNavigation } from '@react-navigation/native';
// Import Firebase auth instance
import { auth } from './firebase';

const SignUpScreen = () => {
  // State for storing user registration input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  // Handle sign up button press
  // Creates new user account in Firebase Authentication
  const handleSignUp = async () => {
    // Validate that passwords match
    if (email && password && confirmPassword && password !== confirmPassword) {
      alert("Please provide all required details for SignUp");
      return;
    }
    try {
      // Create new user with email and password
      // On success, useAuthentication hook will detect login and show main app
      await createUserWithEmailAndPassword(auth, email, password);
      }
      catch(error) {
        // Handle registration errors (email already exists, weak password, etc.)
        const errorMessage = error.message;
        if(errorMessage.indexOf("email-already-in-use") != -1) {
          alert("Email already in use.");
        } else {
          alert(errorMessage)
        }
        console.log(errorMessage);
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
            source={require('./assets/logo.png')} // Chat app logo
            style={styles.logo}
          />
          
          {/* Welcome message for new users */}
          <Text style={styles.header}>Let's start Buddying</Text>

          {/* Email input field with appropriate keyboard */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" // Shows email-optimized keyboard
            autoCapitalize="none" // Prevents automatic capitalization
          />

          {/* Password input field with hidden text */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Hides password characters
          />

          {/* Confirm password field to prevent typos */}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry // Hides password characters
          />

          {/* Sign up button to submit registration */}
          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          {/* Link to login screen for existing users */}
          <View style={styles.loginLinkContainer}>
            <Text>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
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
    width:'80%'
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
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

export default SignUpScreen;
