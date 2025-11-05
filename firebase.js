// Firebase configuration and initialization for React Native Chat App
// This file sets up connection to Firebase backend services
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase project configuration
// Contains API keys and project identifiers for connecting to Firebase services
const firebaseConfig = {
  apiKey: "AIzaSyCLwjocg8VUEJ6-Bqp51leRNbpYOKgIA7I", // API key for authenticating with Firebase
  authDomain: "reactnative-chatapp-872f5.firebaseapp.com", // Domain for authentication redirects
  projectId: "reactnative-chatapp-872f5", // Unique project identifier
  storageBucket: "reactnative-chatapp-872f5.firebasestorage.app", // Cloud Storage bucket URL
  messagingSenderId: "76805643637", // Sender ID for Firebase Cloud Messaging
  appId: "1:76805643637:web:3de2b76aafc1be74acc73c" // Unique app identifier
};

// Initialize Firebase app with configuration
export const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services for use throughout the app
export const db = getFirestore(app); // Firestore database for storing messages and user data
export const auth = getAuth(app); // Authentication service for user sign up/login
export const storage = getStorage(app); // Cloud Storage for profile pictures and media files
