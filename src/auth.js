import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";

// Initialize Firebase Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign-In Function
export const googleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google Sign-In Success:", result.user);
        return result.user;
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        return null;
    }
};

// Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Error logging out", error.message);
    }
};