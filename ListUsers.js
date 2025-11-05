// Import React hooks for state and lifecycle management
import React, { useEffect, useState } from 'react';
// Import React Native components for rendering user list UI
import { View, Text, Pressable, FlatList, Image, StyleSheet } from 'react-native';
// Import Firestore functions for fetching user data from database
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
// Import navigation hooks for screen transitions and refresh triggers
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Import Firebase authentication to identify current user
import { getAuth } from 'firebase/auth';
// Import custom theme hook for dark/light mode support
import { useTheme } from './ThemeContext';

// Component that displays a list of all registered users (buddies)
// Highlights the current user and allows navigation to chat conversations
export const ListUsers = () => {
  const { theme } = useTheme(); // Access current theme for styling
  const [users, setUsers] = useState([]); // Store fetched user list
  const db = getFirestore(); // Firestore database instance
  const auth = getAuth(); // Firebase authentication instance
  const navigation = useNavigation(); // Navigation object for screen transitions

// Fetch users from Firestore whenever screen comes into focus
// useFocusEffect ensures data is refreshed when navigating back to this screen
useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        try {
          // Query Firestore "avatars" collection to get all registered users
          // This collection stores user profiles including email and avatar URL
          const q = query(
           collection(db, "avatars"),
           );
         
           // Execute the query and retrieve all documents
           const querySnapshot = await getDocs(q);
           
           // Transform Firestore documents into JavaScript objects
           const fetchedUsers = querySnapshot.docs.map(doc => ({
               id: doc.id, // Document ID for unique key
               ...doc.data(), // Spread all document fields (email, avatar, etc.)
             }));
             
             // Separate current user from other users for special highlighting
             const currentUser = fetchedUsers.find((user) => user.email === auth.currentUser.email);
             const otherUsers = fetchedUsers.filter((user) => user.email !== auth.currentUser.email);
         
             // Display current user at the top of the list with "YOU" badge
             // This makes it easy to access personal notes feature
             // Only add currentUser if it exists to prevent undefined errors
             if (currentUser) {
               setUsers([currentUser, ...otherUsers]);
             } else {
               setUsers(otherUsers);
             }        
           } catch (error) {
             console.error('Error fetching users:', error);
           }     
      };
      fetchUsers();
    }, [])
  );
	
  // Only render UI if users array has been populated
  if (users){
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header banner showing currently logged-in user email */}
        {/* Modern curved design with gradient-like orange background */}
        <View style={[styles.headerContainer, { backgroundColor: theme.primary }]}>
          <Text style={[styles.headerText, { color: theme.isDark ? '#FED7AA' : '#FFF7ED' }]}>Logged in as:</Text>
          <Text style={[styles.currentUserEmail, { color: theme.textLight }]}>{auth.currentUser?.email}</Text>
        </View>

        {/* FlatList renders scrollable list of users efficiently */}
        {/* Only renders visible items for better performance with large lists */}
        <FlatList
          data={users}
          // Use document ID as unique key, fallback to index for safety
          keyExtractor={(item, index) => item?.id || index.toString()}
          renderItem={({ item }) => {
            // Guard clause: Skip rendering if item data is missing
            // Prevents crashes from undefined items in the array
            if (!item) return null;
            
            // Determine if this list item represents the logged-in user
            // Used for special styling and "YOU" badge display
            const isCurrentUser = item.email === auth.currentUser?.email;
            
            return (
              <View>
                {/* Pressable card for each user in the list */}
                {/* Clicking navigates to chat screen with that user */}
                <Pressable 
                  style={[
                    styles.userContainer,
                    { backgroundColor: theme.cardBackground },
                    // Special highlighting for current user: orange background and border
                    isCurrentUser && { 
                      backgroundColor: theme.primaryLight,
                      borderWidth: 2,
                      borderColor: theme.primary 
                    }
                  ]}
                  onPress={() => {
                    // Navigate to ChatScreen with recipient information
                    // isSelfChat flag enables personal notes mode when true
                    navigation.navigate('ChatScreen', { 
                      receiver: item.email,
                      receiverName: item.email,
                      isSelfChat: isCurrentUser // True if chatting with yourself
                    });
                  }}
                >
                  {/* User avatar image (circular) */}
                  {/* Displays uploaded avatar or falls back to default placeholder */}
                  <Image 
                    source={{ 
                      uri: item.avatar ? item.avatar : 'https://randomuser.me/api/portraits/lego/1.jpg' 
                    }} 
                    style={[
                      styles.avatar,
                      isCurrentUser && { borderColor: theme.primary } // Orange border for current user
                    ]} 
                  />
                  
                  {/* User information section (email and badges) */}
                  <View style={styles.userInfo}>
                    <View style={styles.emailContainer}>
                      {/* Display user email with special styling for current user */}
                      <Text style={[
                        styles.username,
                        { color: theme.text },
                        isCurrentUser && { fontWeight: 'bold', color: theme.primary }
                      ]}>
                        {item.email}
                      </Text>
                      
                      {/* "YOU" badge displayed only for the logged-in user */}
                      {/* Helps users quickly identify their own profile */}
                      {isCurrentUser && (
                        <View style={[styles.youBadge, { backgroundColor: theme.primary }]}>
                          <Text style={styles.youBadgeText}>YOU</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Subtitle explaining personal notes feature for current user */}
                    {/* Only visible on your own profile card */}
                    {isCurrentUser && (
                      <Text style={[styles.currentUserSubtext, { color: theme.textSecondary }]}>
                        💾 Personal Notes & Reminders
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}>
        <Text style={{fontSize: 20, color: theme.text}}>No buddies to load!</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F9FA',
	},
	headerContainer: {
		backgroundColor: '#6366F1',
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		elevation: 8,
		shadowColor: '#6366F1',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
	},
	headerText: {
		fontSize: 13,
		color: '#E0E7FF',
		fontWeight: '600',
		marginBottom: 6,
		letterSpacing: 0.5,
	},
	currentUserEmail: {
		fontSize: 18,
		color: '#ffffff',
		fontWeight: 'bold',
		letterSpacing: 0.3,
	},
	userContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		marginHorizontal: 12,
		marginVertical: 6,
		backgroundColor: '#ffffff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
	},
	currentUserContainer: {
		backgroundColor: '#F0F9FF',
		borderWidth: 2,
		borderColor: '#6366F1',
		elevation: 4,
		shadowColor: '#6366F1',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
		marginRight: 14,
		borderWidth: 2.5,
		borderColor: '#E5E7EB',
	},
	currentUserAvatar: {
		borderColor: '#6366F1',
		borderWidth: 3,
	},
	userInfo: {
		flex: 1,
	},
	emailContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
		flexWrap: 'wrap',
	},
	username: {
		fontSize: 15,
		color: '#1F2937',
		fontWeight: '600',
		marginRight: 8,
		letterSpacing: 0.2,
	},
	currentUserText: {
		color: '#6366F1',
		fontWeight: 'bold',
	},
	youBadge: {
		backgroundColor: '#6366F1',
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 12,
		elevation: 1,
	},
	youBadgeText: {
		color: '#ffffff',
		fontSize: 10,
		fontWeight: 'bold',
		letterSpacing: 0.5,
	},
	currentUserSubtext: {
		fontSize: 12,
		color: '#6366F1',
		fontWeight: '500',
		marginTop: 2,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		fontWeight: 'bold',
	},
});
  
