// Profile settings screen allowing users to upload avatars and toggle themes
// Integrates with Firebase Storage for image uploads and Firestore for metadata
import React, { useState, useEffect } from 'react';
// Import React Native components for UI rendering
import { View, Text, Image, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
// Import Expo ImagePicker for accessing device gallery and camera
import * as ImagePicker from 'expo-image-picker';
// Import Firestore functions for database operations
import { query, where, setDoc, collection, getDocs, addDoc, doc } from 'firebase/firestore';
// Import Firebase Storage functions for image upload and retrieval
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Import Firebase configuration instances
import { auth, db, storage } from './firebase';
// Import Toast for user-friendly notifications
import Toast from "react-native-toast-message";
// Import custom theme hook for dark/light mode functionality
import { useTheme } from './ThemeContext';
// Import icon library for theme toggle button
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme(); // Access theme state and toggle function
  const [avatar, setAvatar] = useState(null); // Store current avatar URL
  const [userEmail, setUserEmail] = useState(''); // Store logged-in user's email
  const [imageUrl, setImageUrl] = useState(''); // Store temporary image URL during upload
  const [docRef, setDocRef] = useState(null); // Store Firestore document reference for updates

  // Fetch current authenticated user's email on component mount
  // This identifies which user's avatar to display and modify
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    } else {
      // Show alert if user is somehow not authenticated
      Alert.alert('User not logged in', 'Please log in to upload an avatar.');
    }
  }, []);

  // Fetch existing avatar from Firestore database
  // Checks if user has previously uploaded a profile picture
  const fetchAvatar = async () => {
    try {
      // Query Firestore "avatars" collection for current user's document
      const q = query(collection(db, "avatars"), where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);

      // Process results if user document exists
      if (!querySnapshot.empty) {
        querySnapshot.forEach((docItem) => {
          // Store document reference for future update operations
          // This allows us to use setDoc() instead of addDoc() to avoid duplicates
          const avatarDocRef = doc(db, "avatars", docItem.id);
          setDocRef(avatarDocRef);
          
          // Set avatar state if user has uploaded one previously
          if(docItem.data().avatar) {
            setAvatar(docItem.data().avatar);
          }
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  };

  // Run fetchAvatar once when component mounts
  // This loads the existing avatar when screen opens
  useEffect(() => {  
    fetchAvatar();
  }, []);

  // Upload selected image to Firebase Storage
  // Returns the publicly accessible download URL for storing in Firestore
  const uploadImage = async (uri) => {
    // Convert image URI to Blob format required by Firebase Storage
    const response = await fetch(uri);
    const blob = await response.blob();
    
    console.log(ref);
    
    // Create unique storage path using timestamp to avoid filename conflicts
    // Images stored in "profile_pics" directory with .jpg extension
    const storageRef = ref(storage, `profile_pics/${new Date().getTime()}.jpg`);

    // Upload the blob to Firebase Storage
    await uploadBytes(storageRef, blob);
    
    // Get the publicly accessible URL of the uploaded image
    // This URL will be stored in Firestore and used to display avatar
    const url = await getDownloadURL(storageRef);
    return url; // Return URL for Firestore storage
  };

  // Launch device gallery to select a new profile picture
  // Handles permission requests, image selection, and upload process
  const pickImage = async () => {
    try {
      // Request user permission to access photo library
      // Required on both iOS and Android
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      // Handle permission denial with user-friendly toast notification
      if (permissionResult.granted === false) {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2: "Permission to access gallery is required!",
          position: "top"
        });
        return;
      }

      // Open image picker with specific configuration
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images, not videos
        allowsEditing: true, // Enable cropping/editing before selection
        aspect: [1, 1], // Force square aspect ratio for profile pictures
        quality: 0.5, // Compress to 50% quality to reduce upload size
      });
      
      console.log("result is ", result);
      
      // Process the selected image if user didn't cancel
      if (!result.canceled) {
        // Upload image to Firebase Storage and get download URL
        const url = await uploadImage(result.assets[0].uri);
        setImageUrl(url); // Store temporary URL
        setAvatar(url); // Update avatar state for immediate UI feedback
        
        // Save avatar URL to Firestore database
        // Create new document if none exists, update existing one if found
        if (!docRef) {
          // First-time upload: Create new Firestore document
          // This happens when user hasn't uploaded an avatar before
          await addDoc(collection(db, "avatars"), {
            email: userEmail,
            avatar: url
          });
          Toast.show({
            type: "success",
            text1: "Avatar Uploaded",
            text2: "Your avatar has been uploaded successfully! 🎉",
            position: "top"
          });
        } else {
          // Subsequent uploads: Update existing Firestore document
          // Prevents duplicate documents for the same user
          await setDoc(docRef, { 
            email: userEmail, 
            avatar: url 
          });
          Toast.show({
            type: "success",
            text1: "Avatar Updated",
            text2: "Your avatar has been updated successfully! ✨",
            position: "top"
          });
        }
      }
    } catch (error) {
      // Handle any errors during the upload process
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Failed to upload avatar. Please try again.",
        position: "top"
      });
    }
  };

  // Main UI render
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Modern curved header with orange gradient effect */}
      <View style={styles.headerSection}>
        {/* Background decorative layer */}
        <View style={[styles.headerBackground, { backgroundColor: theme.primary }]} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.textLight }]}>Profile Settings</Text>
          <Text style={[styles.headerSubtitle, { color: theme.isDark ? '#FED7AA' : '#FFF7ED' }]}>Customize your profile picture</Text>
        </View>
      </View>

      {/* Main scrollable content area */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Profile picture upload section */}
        <View style={styles.avatarSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile Picture</Text>
          
          {/* Avatar display without edit overlay */}
          {/* Removed Pressable wrapper - users can change photo via button below */}
          <View style={styles.avatarPressable}>
            <View style={styles.avatarContainer}>
              {/* Conditional rendering: Show uploaded avatar or placeholder */}
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                // Placeholder shown when no avatar has been uploaded yet
                <View style={[styles.avatarPlaceholderContainer, { backgroundColor: theme.primaryLight }]}>
                  <Text style={styles.avatarPlaceholderIcon}>📷</Text>
                  <Text style={[styles.avatarPlaceholder, { color: theme.primary }]}>No Photo Yet</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Helper text explaining how to change avatar */}
          <Text style={[styles.avatarHint, { color: theme.textSecondary }]}>
            Use the button below to change your profile picture
          </Text>
        </View>

        {/* User information display card */}
        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{userEmail}</Text>
            </View>
          </View>
        </View>

        {/* Dark/Light mode toggle button */}
        {/* Shows sun icon in dark mode, moon icon in light mode */}
        <Pressable 
          style={[styles.themeToggle, { backgroundColor: theme.cardBackground, borderColor: theme.border }]} 
          onPress={toggleTheme}
          android_ripple={{ color: theme.primary + '30' }} // Ripple effect on Android
        >
          <View style={[styles.themeIconContainer, { backgroundColor: theme.primaryLight }]}>
            {/* Dynamic icon based on current theme state */}
            <MaterialCommunityIcons 
              name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} 
              size={24} 
              color={theme.primary} 
            />
          </View>
          <View style={styles.themeTextContainer}>
            <Text style={[styles.themeTitle, { color: theme.text }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
            <Text style={[styles.themeSubtitle, { color: theme.textSecondary }]}>
              Switch to {isDark ? 'light' : 'dark'} theme
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
        </Pressable>

        {/* Action Button */}
        <Pressable 
          style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
          onPress={pickImage}
          android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <Text style={styles.buttonIcon}>📸</Text>
          <Text style={styles.buttonText}>Choose New Photo</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerSection: {
    position: 'relative',
    height: 180,
    marginBottom: 0,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#6366F1',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#E0E7FF',
    letterSpacing: 0.3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 60,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  avatarPressable: {
    marginBottom: 12,
  },
  avatarContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#ffffff',
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 4,
  },
  avatarOverlayText: {
    fontSize: 18,
  },
  avatarHint: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 24,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeTextContainer: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 13,
  },
});

export default SettingsScreen;
