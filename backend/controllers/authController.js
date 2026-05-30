import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../services/dbService.js";

/**
 * Controller to handle SaaS User Signups
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: { code: "auth/missing-fields", message: "Please fill in all fields." }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: { code: "auth/weak-password", message: "Password should be at least 6 characters." }
      });
    }

    // Check existing
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: { code: "auth/email-already-in-use", message: "An account already exists with this email address." }
      });
    }

    // Hash credentials
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save Doc
    const newUser = await createUser(name, email, hashedPassword, role);

    res.status(201).json({
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.name,
      role: newUser.role
    });
  } catch (error) {
    console.error("Signup Controller Error:", error);
    res.status(500).json({
      error: { code: "auth/internal-error", message: "An error occurred during signup." }
    });
  }
};

/**
 * Controller to handle SaaS User Logins
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { code: "auth/missing-fields", message: "Please enter email and password." }
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: { code: "auth/user-not-found", message: "No account found with this email." }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: { code: "auth/wrong-password", message: "Incorrect password. Please try again." }
      });
    }

    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.name,
      role: user.role
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({
      error: { code: "auth/internal-error", message: "An error occurred during login." }
    });
  }
};
