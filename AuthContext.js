import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, saveFeedback } from "./firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleFeedback = async () => {
    await saveFeedback(feedback);

    setFeedback("");
    setOpenModal(false);
    setSuccess("Feedback submitted successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        feedback,
        setFeedback,
        success,
        setSuccess,
        error,
        setError,
        apiCallCount,
        setApiCallCount,
        open,
        setOpen,
        openModal,
        setOpenModal,
        handleModalOpen,
        handleModalClose,
        handleFeedback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
