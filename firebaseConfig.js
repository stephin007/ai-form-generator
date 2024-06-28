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
  getDocs,
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

const incrementApiCallCount = async (userId, userEmail) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentData = userDoc.data();
    const currentCount = currentData.apiCallCount || 0;

    // Update the apiCallCount
    const updateData = { apiCallCount: currentCount + 1 };

    if (!currentData.email) {
      // Only set the email if it is not already set
      updateData.email = userEmail;
    }

    await updateDoc(userRef, updateData);
    return {
      apiCallCount: currentCount + 1,
      email: currentData.email || userEmail,
    };
  } else {
    // Create the user document with apiCallCount and email
    await setDoc(userRef, {
      apiCallCount: 1,
      email: userEmail,
    });
    return { apiCallCount: 1, email: userEmail };
  }
};

const saveFeedback = async (feedback) => {
  try {
    const feedbackRef = collection(db, "feedback");
    await addDoc(feedbackRef, {
      feedback: feedback,
    });
  } catch (error) {
    console.error("Error saving feedback: ", error);
  }
};

const saveToProfile = async (formSchema, userEmail, userId) => {
  try {
    const userFormsRef = collection(db, "users", userId, "forms");
    await addDoc(userFormsRef, {
      userEmail: userEmail,
      userId: userId,
      formSchema: formSchema,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Error saving form: ", err);
  }
};

const fetchForms = async (userId) => {
  try {
    const formsRef = collection(db, "users", userId, "forms");
    const formsSnapshot = await getDocs(formsRef);
    console.log("formsSnapshot: ", formsSnapshot);

    const userForms = formsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return userForms;
  } catch (err) {
    console.error("Error fetching forms: ", err);
    return [];
  }
};

export {
  auth,
  signInWithGoogle,
  logout,
  getUserApiCallCount,
  incrementApiCallCount,
  saveFeedback,
  saveToProfile,
  fetchForms,
};
