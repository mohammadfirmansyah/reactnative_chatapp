// Custom React hook for managing authentication state
// Listens to Firebase auth changes and provides current user information
import { useState, useEffect } from "react";

// Import Firebase auth state listener
import { onAuthStateChanged } from "@firebase/auth";

// Import Firebase auth instance
import {auth} from "./firebase";

// Hook that returns the currently authenticated user
// Used in App.js to determine which navigation stack to show
export default function useAuthentication() {
	// State to store current user object (null if not logged in)
	const [user, setUser] = useState(null);

	// Set up authentication state listener on component mount
	useEffect(()=>{
		// Subscribe to authentication state changes
		// This fires whenever user logs in, logs out, or on app start
		const unsub = onAuthStateChanged(auth, user=>{
			console.log("User details \n",user);
			if(user){
				// User is signed in, store user object
				setUser(user);
			} else {
				// User is signed out, clear user state
				setUser(null);
			}
		})
		
		// Cleanup: Unsubscribe from listener when component unmounts
		// (Note: Currently missing return statement for cleanup)
	},[]);
	
	// Return user object for consumption by components
	return {user};
}