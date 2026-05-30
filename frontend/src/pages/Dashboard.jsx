import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import DeveloperDashboard from "./DeveloperDashboard";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Dashboard = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [resolvedRole, setResolvedRole] = useState(currentUser?.role || null);
  const [loadingRole, setLoadingRole] = useState(!currentUser?.role);

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role) {
      setResolvedRole(currentUser.role);
      setLoadingRole(false);
      return;
    }

    // Resilient fallback: fetch role from Firestore users collection if missing in localStorage session
    const fetchUserRole = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("email", "==", currentUser.email.toLowerCase().trim())
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          let dbUser = null;
          querySnapshot.forEach((doc) => {
            dbUser = doc.data();
          });
          if (dbUser && dbUser.role) {
            setResolvedRole(dbUser.role);
            // Save inside context to refresh localStorage too!
            setCurrentUser({ ...currentUser, role: dbUser.role });
          }
        }
      } catch (error) {
        console.error("Firestore user role query error:", error);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [currentUser, setCurrentUser]);

  if (!currentUser || loadingRole) {
    return (
      <div className="min-h-screen bg-[#07070a] text-zinc-100 flex items-center justify-center font-sans">
        <div className="space-y-4 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-zinc-400 text-sm">Verifying workspace permissions...</p>
        </div>
      </div>
    );
  }

  // Render AdminDashboard if user's role is Admin, otherwise DeveloperDashboard
  if (resolvedRole === "Admin") {
    return <AdminDashboard />;
  }

  return <DeveloperDashboard />;
};

export default Dashboard;
