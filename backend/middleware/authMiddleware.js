import { db } from "../config/firebase.js";

/**
 * Express Middleware to authorize user roles and verify authorization tokens.
 * In a production system, this verifies JWTs or Firebase ID tokens.
 */
export const verifyAuthToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: { code: "auth/unauthorized", message: "Access denied. Token missing." }
      });
    }

    const token = authHeader.split(" ")[1];
    
    // In standard Firebase environments, we use admin.auth().verifyIdToken(token)
    // For local dev, we parse the token which represents the User's UID
    if (!token) {
      return res.status(401).json({
        error: { code: "auth/invalid-token", message: "Access denied. Invalid token." }
      });
    }

    // Attach user credentials to request scope
    req.userId = token;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(500).json({
      error: { code: "auth/server-error", message: "Failed to authenticate session." }
    });
  }
};

/**
 * Middleware to authorize specific role groups (e.g. only Admins can create tasks or delete projects).
 */
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const uid = req.headers["x-user-uid"] || req.userId;
      if (!uid) {
        return res.status(401).json({
          error: { message: "Unauthorized. Missing user context headers." }
        });
      }

      // Query database to read active user role
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      
      let userRole = null;
      if (userDoc.exists) {
        userRole = userDoc.data().role;
      } else {
        // Search by email lookup if document is flat
        const snapshot = await db.collection("users").where("uid", "==", uid).get();
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            userRole = doc.data().role;
          });
        }
      }

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: { code: "auth/forbidden", message: "Forbidden. Insufficient role permissions." }
        });
      }

      req.userRole = userRole;
      next();
    } catch (error) {
      res.status(500).json({
        error: { message: "Internal role authorization verification failed." }
      });
    }
  };
};
