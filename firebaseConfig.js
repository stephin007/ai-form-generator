// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_SECRET,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, { apiCallCount: 0 });
    }
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

const getUserApiCallCount = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().apiCallCount;
  } else {
    return 0;
  }
};

const incrementApiCallCount = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentCount = userDoc.data().apiCallCount;
    await updateDoc(userRef, { apiCallCount: currentCount + 1 });
    return currentCount + 1;
  } else {
    await setDoc(userRef, { apiCallCount: 1 });
    return 1;
  }
};

const saveFeedback = async (userId, feedback, userDetails) => {
  try {
    const feedbackRef = collection(db, "feedback");
    await addDoc(feedbackRef, {
      userId: userId,
      feedback: feedback,
      userDetails: userDetails,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving feedback: ", error);
  }
};

export {
  auth,
  signInWithGoogle,
  logout,
  getUserApiCallCount,
  incrementApiCallCount,
  saveFeedback,
};
