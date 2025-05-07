import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig"; // Correctly import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase Auth functions

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider to wrap the app and provide user context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store the authenticated user

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state whenever auth state changes
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []); // Empty dependency array, so this runs only once on mount

  // Logout function
  const logout = async () => {
    await signOut(auth); // Sign out the user
  };

  // Provide user and logout function to children
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
