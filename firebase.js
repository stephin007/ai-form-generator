// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.YOUR_API_KEY,
  authDomain: process.env.YOUR_AUTH_DOMAIN,
  projectId: process.env.YOUR_PROJECT_ID,
  storageBucket: process.env.YOUR_STORAGE_BUCKET,
  messagingSenderId: process.env.YOUR_MESSAGING_SENDER_ID,
  appId: process.env.YOUR_APP_ID,
  measurementId: process.env.YOUR_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Listen for authentication state to change.
onAuthStateChanged(auth, (user) => {
    if (typeof window !== "undefined" && user) {
        // User is signed in, save user info in local storage
        localStorage.setItem('user', JSON.stringify(user));
    } else if (typeof window !== "undefined") {
        // User is signed out, clear local storage
        localStorage.removeItem('user');
    }
});

export { auth, provider };