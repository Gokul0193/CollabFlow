const API_URL = "http://localhost:5001/api/auth";

export const signup = async (name, email, password, role) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error?.message || "Registration failed.");
      error.code = data.error?.code;
      throw error;
    }

    return data; // Returns { uid, email, displayName }
  } catch (err) {
    console.error("Signup error in authService:", err);
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error?.message || "Sign in failed.");
      error.code = data.error?.code;
      throw error;
    }

    return data; // Returns { uid, email, displayName,role }
  } catch (err) {
    console.error("Login error in authService:", err);
    throw err;
  }
};

export const logout = async () => {
  // Clear any backend sessions if necessary, otherwise return resolved promise
  return Promise.resolve();
};

export const getAuthErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred.";

  // Custom mappings for user friendliness
  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/missing-fields":
      return error.message;
    default:
      return error.message || "An unexpected error occurred.";
  }
};