import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("collabflow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session is loaded synchronously from localStorage
    setLoading(false);
  }, []);

  const setCurrentUserAndStore = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("collabflow_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("collabflow_user");
    }
  };




  const value = {
    currentUser,
    setCurrentUser: setCurrentUserAndStore
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};