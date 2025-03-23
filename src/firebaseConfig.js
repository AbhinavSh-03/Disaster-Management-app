import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApoZSKcgKXFSz4sQYPRTzTOcZIeKgtCig",
  authDomain: "disaster-app-37149.firebaseapp.com",
  projectId: "disaster-app-37149",
  storageBucket: "disaster-app-37149.appspot.com",  
  messagingSenderId: "462098468512",
  appId: "1:462098468512:web:639c6a22c60ca0347c43c5",
  measurementId: "G-J18L4MLCYD"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export  { app,auth };