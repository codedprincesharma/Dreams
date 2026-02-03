/**
 * =======================================================
 * ADMIN ONLY
 * =======================================================
 */
export const isAdmin = (req, res, next) => {
  try {
    console.log(`[ROLE] Admin check for URL: ${req.url}, User:`, req.user?.email);

    if (!req.user) {
      console.log("[ROLE] No user object found");
      return res.status(403).json({ message: "Access denied. No user found." });
    }

    if (req.user.role !== "admin") {
      console.log("[ROLE] User is not admin, role:", req.user.role);
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    console.log("[ROLE] Admin access granted");
    next();
  } catch (err) {
    console.error("[ROLE] Error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * PRINCIPAL ONLY
 * =======================================================
 */
export const isPrincipal = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Access denied. Principal only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * TEACHER ONLY
 * =======================================================
 */
export const isTeacher = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Teacher only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * STUDENT ONLY
 * =======================================================
 */
export const isStudent = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. Student only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * MULTI-ROLE ACCESS (OPTIONAL – VERY USEFUL)
 * Usage: allowRoles("admin","principal")
 * =======================================================
 */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Allowed roles: ${roles.join(", ")}`
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};
