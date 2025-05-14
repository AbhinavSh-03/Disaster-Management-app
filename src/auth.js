import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "./firebaseConfig"; // Make sure db is exported from firebaseConfig

// Initialize Firebase Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign-In Function
export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Google Sign-In Success:", user);

    // Create or update user document in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const role = user.email === "sab027957@gmail.com" ? "admin" : "user";

      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || "Unnamed User",
        role,
      });

      console.log("User document created with role:", role);
    } else {
      console.log("User document already exists");
    }

    return user;
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
