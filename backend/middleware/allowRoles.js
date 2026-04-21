const allowRoles = (...roles) => {
  return (req, res, next) => {
    // 1. Check if user was actually attached by the 'protect' middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no user found" });
    }

    // 2. Check for role (case-insensitive check is safer)
    const userRole = req.user.role?.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access denied. Role '${userRole}' is not authorized.` 
      });
    }

    next();
  };
};

export default allowRoles;