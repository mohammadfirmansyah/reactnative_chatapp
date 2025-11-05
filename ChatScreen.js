// Import necessary React hooks for state management and lifecycle
import React, { useState, useEffect, useCallback } from 'react';
// Import React Native components for UI rendering
import { Pressable, Text, View, Image, StyleSheet, TextInput, Dimensions } from 'react-native';
// Import GiftedChat library and InputToolbar component for chat UI
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
// Import custom theme hook for dark/light mode support
import { useTheme } from './ThemeContext';
// Import Firestore functions for database operations
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore';
// Import Firebase authentication for user sign out
import { signOut } from 'firebase/auth';
// Import Firebase configuration and database instance
import { auth, db } from './firebase';
// Import navigation hooks for screen transitions
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Import icon library for UI elements
import { AntDesign } from '@expo/vector-icons';
// Import color constants (legacy - now using theme)
import colors from './colors';
// Import route hook to access navigation parameters
import { useRoute } from '@react-navigation/native';

export default function ChatScreen() {
  // Initialize state for storing chat messages array
  const [messages, setMessages] = useState([]);
  // Store current user's avatar URL
  const [avatar, setAvatar] = useState(null);
  // Store the email of the chat recipient
  const [receiver, setReceiever] = useState(null);
  // Store current logged-in user's email
  const [user, setUser] = useState(null);
  // Track if user is chatting with themselves (personal notes mode)
  const [isSelfChat, setIsSelfChat] = useState(false);
  // Access navigation object for screen transitions
  const navigation = useNavigation();
  // Access route parameters passed from previous screen
  const route = useRoute();
  // Get current theme (light/dark mode) from context
  const { theme } = useTheme();
  
  // Calculate maximum bubble width (80% of screen width minus margins)
  const screenWidth = Dimensions.get('window').width;
  const maxBubbleWidth = screenWidth * 0.8 - 16; // 80% minus horizontal margins

  // Set current user's email when component mounts
  useEffect(() => {
    setUser(auth.currentUser.email);
  }, []);

  // Update receiver and self-chat mode when route params change
  // This triggers when user selects someone from the buddies list
  useEffect(() => {
    if (route.params?.receiver) {
      setReceiever(route.params.receiver);
      setIsSelfChat(route.params?.isSelfChat || false);
    }
  }, [route.params]);

  // Fetch user's avatar from Firestore when screen comes into focus
  // useFocusEffect runs every time the screen is focused (navigated to)
  useFocusEffect(
    useCallback(() => {
      const fetchAvatar = async () => {
        try {
          // Query Firestore to find avatar document matching current user's email
          const q = query(collection(db, "avatars"), where("email", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(q);

          // If avatar document exists, update state with avatar URL
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              setAvatar(doc.data().avatar);
            });
          }
        } catch (error) {
          // Log any errors during avatar fetch for debugging
          console.error("Error fetching avatar: ", error);
        }
      };
      fetchAvatar();
    }, [])
  );

  // Set up real-time message listener when receiver or user changes
  useEffect(() => {
    // Exit early if receiver or user is not set yet
    if (!receiver || !user) return;

    // Create a simple Firestore query to fetch all chats ordered by timestamp
    // We use client-side filtering instead of complex queries to avoid index requirements
    const chatQuery = query(
      collection(db, 'chats'),
      orderBy('createdAt', 'desc')
    );

    // Subscribe to real-time updates from Firestore
    // onSnapshot triggers whenever data changes in the database
    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      // Map Firestore documents to message objects
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JavaScript Date object
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      }));

      // Filter messages to show only conversation between current user and receiver
      // This handles both directions: user→receiver and receiver→user
      const filteredMessages = allMessages.filter(msg => {
        const msgUser = msg.user?._id || msg.user;
        const msgReceiver = msg.receiver;
        
        return (
          (msgUser === user && msgReceiver === receiver) ||
          (msgUser === receiver && msgReceiver === user)
        );
      });

      // Sort messages with newest first (GiftedChat displays in reverse)
      filteredMessages.sort((a, b) => b.createdAt - a.createdAt);
      
      // Update state with filtered and sorted messages
      setMessages(filteredMessages);
    }, (error) => {
      // Handle any errors during message fetching
      console.error("Error fetching messages:", error);
    });

    // Cleanup function to unsubscribe from listener when component unmounts
    // This prevents memory leaks and unnecessary database reads
    return () => {
      unsubscribe();
    };
  }, [receiver, user]);

  // Handle sending new messages to Firestore
  // useCallback prevents function recreation on every render for performance
  const onSend = useCallback(async (messages = []) => {
    // Validate that both receiver and user are defined before sending
    if (!receiver || !user) {
      console.error("Receiver or user not defined");
      return;
    }

    try {
      // Destructure message object to get required fields
      const { _id, createdAt, text, user: messageUser } = messages[0];
      
      // Save message to Firestore database
      // This triggers real-time updates for both sender and receiver
      await addDoc(collection(db, 'chats'), {
        _id,
        createdAt: createdAt || new Date(),
        text,
        user: messageUser,
        receiver: receiver,
      });

      console.log("Message sent successfully");
    } catch (error) {
      // Handle and log any errors during message sending
      console.error("Error sending message:", error);
    }
  }, [receiver, user]);

  // Handle user sign out from Firebase authentication
  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  // Customize navigation header with theme-aware styling
  // This useEffect runs whenever navigation, receiver, isSelfChat, or theme changes
  useEffect(() => {
    navigation.setOptions({
      // Apply modern header styling with shadows and elevation
      headerStyle: {
        backgroundColor: theme.headerBg,
        elevation: 8, // Android shadow depth
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 }, // iOS shadow positioning
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      headerTintColor: theme.textLight,
      
      // Custom header title shows context-aware information
      // Displays "Personal Notes" for self-chat or "Chat with [email]" for others
      headerTitle: () => (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.isDark ? '#FED7AA' : '#FFF7ED', letterSpacing: 0.5 }}>
            {isSelfChat ? '💾 Personal Notes' : 'Chat with'}
          </Text>
          <Text style={{ fontSize: 15, color: theme.textLight, fontWeight: 'bold', marginTop: 2 }}>
            {receiver || 'Select a buddy'}
          </Text>
        </View>
      ),
      
      // Custom logout button positioned in the top-right corner
      // Styled with semi-transparent background for modern look
      headerRight: () => (
        <Pressable 
          style={{ 
            marginRight: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 8,
            borderRadius: 10,
          }} 
          onPress={onSignOut}
        >
          <AntDesign name="logout" size={20} color={theme.textLight} />
        </Pressable>
      ),
      headerShown: true,
    });
  }, [navigation, receiver, isSelfChat, theme]);

  // Display empty state when no conversation is selected
  // This occurs when user navigates to Chat tab without selecting a buddy first
  if (!receiver) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, padding: 32 }}>
        {/* Large message icon in a circular container */}
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: theme.primaryLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <AntDesign name="message1" size={56} color={theme.primary} />
        </View>
        
        {/* Friendly message prompting user to select a buddy */}
        <Text style={{ fontSize: 22, color: theme.text, textAlign: 'center', marginBottom: 12, fontWeight: 'bold' }}>
          No Conversation Selected
        </Text>
        <Text style={{ fontSize: 15, color: theme.textSecondary, textAlign: 'center', lineHeight: 22 }}>
          Go to Buddies tab and select{'\n'}someone to start chatting
        </Text>
      </View>
    );
  }

  // Main chat interface render
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Contextual info banner displayed above chat messages */}
      {/* Shows different content for self-chat vs regular conversation */}
      {isSelfChat ? (
        // Personal Notes banner for self-chat mode
        // Helps users understand this is their private note-taking space
        <View style={{ 
          backgroundColor: theme.primaryLight, 
          padding: 14,
          borderBottomWidth: 2,
          borderBottomColor: theme.primary,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {/* Icon container with circular background */}
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <AntDesign name="save" size={20} color={theme.textLight} />
          </View>
          
          {/* Banner text explaining personal notes feature */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: theme.primary, fontWeight: 'bold', marginBottom: 2 }}>
              💾 Personal Notes Space
            </Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>
              Save messages, reminders, and ideas here
            </Text>
          </View>
        </View>
      ) : (
        // Regular chat banner showing conversation participants
        // Displays both logged-in user and chat recipient
        <View style={{ 
          backgroundColor: theme.primaryLight, 
          padding: 14,
          borderBottomWidth: 2,
          borderBottomColor: theme.primary,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {/* User icon in circular container */}
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <AntDesign name="user" size={20} color={theme.textLight} />
          </View>
          
          {/* Conversation details showing both participants */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 2 }}>
              You ({user})
            </Text>
            <Text style={{ fontSize: 13, color: theme.primary, fontWeight: 'bold' }}>
              💬 Chatting with: {receiver}
            </Text>
          </View>
        </View>
      )}

      {/* GiftedChat component provides the main chat UI and functionality */}
      {/* We customize its appearance through render props and styling */}
      {/* Key prop forces re-render when theme changes to update all styled components */}
      <GiftedChat
        key={theme.isDark ? 'dark' : 'light'}
        messages={messages}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        onSend={messages => onSend(messages)}
        bottomOffset={80}
        
        messagesContainerStyle={{
          backgroundColor: theme.background,
        }}
        
        textInputStyle={{
          backgroundColor: theme.cardBackground,
          color: theme.text,
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 15,
          lineHeight: 20,
          borderRadius: 20,
          marginRight: 8,
        }}
        
        textInputProps={{
          placeholder: isSelfChat ? "Write a note or reminder..." : "Type a message...",
          placeholderTextColor: theme.textSecondary,
        }}
        
        minInputToolbarHeight={60}
        minComposerHeight={44}
        
        // Custom input toolbar renderer to apply theme-aware background
        // Renders the default InputToolbar with custom container styling
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: theme.cardBackground, // Adapts to dark/light mode
              borderTopWidth: 1,
              borderTopColor: theme.border, // Theme-aware border
              paddingHorizontal: 4,
              paddingVertical: 4,
              minHeight: 60,
            }}
            primaryStyle={{
              alignItems: 'center',
            }}
          />
        )}
        
        // Custom chat bubble renderer for complete control over message appearance
        // Creates distinct styles for sent vs received messages
        renderBubble={(props) => (
          <View>
            {/* Check if the message is from the current user (sent by you) */}
            {props.currentMessage.user._id === auth?.currentUser?.email ? (
              // Sent messages: Orange background, aligned right
              <View style={{
                backgroundColor: theme.messageYou, // Orange color for sent messages
                borderRadius: 20,
                borderBottomRightRadius: 4, // Pointed corner on bottom-right (speech bubble effect)
                padding: 12,
                marginVertical: 4,
                marginHorizontal: 8,
                maxWidth: maxBubbleWidth, // Calculated width to prevent overflow
                alignSelf: 'flex-end', // Align to the right side
                elevation: 2, // Android shadow
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
                {/* Message text with light color for contrast on orange background */}
                {/* flexWrap ensures long text wraps, width: '100%' prevents overflow */}
                <Text style={{ 
                  color: theme.textLight, 
                  fontSize: 15,
                  lineHeight: 20,
                  flexWrap: 'wrap',
                  width: '100%',
                }}>
                  {props.currentMessage.text}
                </Text>
                
                {/* Timestamp in 24-hour format (e.g., 14:30) */}
                {/* Using 'en-GB' locale ensures 24-hour time without AM/PM */}
                <Text style={{ 
                  color: theme.isDark ? '#FED7AA' : '#FFF7ED', 
                  fontSize: 11, 
                  marginTop: 4,
                  alignSelf: 'flex-end',
                }}>
                  {new Date(props.currentMessage.createdAt).toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false // Critical: Removes AM/PM suffix
                  })}
                </Text>
              </View>
            ) : (
              // Received messages: White/card background, aligned left
              <View style={{
                backgroundColor: theme.messageOther, // White or card color for received messages
                borderRadius: 20,
                borderBottomLeftRadius: 4, // Pointed corner on bottom-left
                padding: 12,
                marginVertical: 4,
                marginHorizontal: 8,
                maxWidth: maxBubbleWidth, // Calculated width to prevent overflow
                alignSelf: 'flex-start', // Align to the left side
                elevation: 1,
                shadowColor: theme.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                borderWidth: 1,
                borderColor: theme.border,
              }}>
                {/* Message text with dark color for readability */}
                {/* flexWrap ensures long text wraps, width: '100%' prevents overflow */}
                <Text style={{ 
                  color: theme.text, 
                  fontSize: 15,
                  lineHeight: 20,
                  flexWrap: 'wrap',
                  width: '100%',
                }}>
                  {props.currentMessage.text}
                </Text>
                
                {/* Timestamp for received messages */}
                <Text style={{ 
                  color: theme.textSecondary, 
                  fontSize: 11, 
                  marginTop: 4,
                }}>
                  {new Date(props.currentMessage.createdAt).toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </Text>
              </View>
            )}
          </View>
        )}
        // Custom send button with modern circular design and orange color
        // Replaces the default GiftedChat send button for better visual consistency
        renderSend={(props) => (
          <Pressable
            onPress={() => {
              // Only send if there's text content
              // trim() removes leading/trailing whitespace to prevent empty messages
              if (props.text && props.onSend) {
                props.onSend({ text: props.text.trim() }, true);
              }
            }}
            style={{
              backgroundColor: theme.primary, // Orange button for brand consistency
              borderRadius: 24, // Fully circular button
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
              marginBottom: 4,
              elevation: 3, // Android shadow for depth effect
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          >
            {/* Up arrow icon indicating "send" action */}
            <AntDesign name="arrowup" size={24} color={theme.textLight} />
          </Pressable>
        )}
        
        user={{
          _id: auth?.currentUser?.email,
          avatar: avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
        }}
        
        alwaysShowSend={true}
        
        // Custom avatar renderer with circular border highlighting current user
        renderAvatar={(props) => (
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18, // Makes avatar circular
            overflow: 'hidden', // Ensures image stays within circular boundary
            marginRight: 8,
            marginBottom: 8,
            borderWidth: 2,
            // Orange border for sent messages, gray for received messages
            borderColor: props.currentMessage.user._id === auth?.currentUser?.email ? theme.primary : theme.border,
          }}>
            {/* Display user's profile picture from Firebase or use default */}
            <Image 
              source={{ uri: props.currentMessage.user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )}
      />
    </View>
  );
}
