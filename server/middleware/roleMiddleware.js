/**
 * Role-Based Access Control (RBAC) middleware
 * Ensures the authenticated user possesses one of the allowed roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization check.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] roles. Your current role is '${req.user.role}'.`
      });
    }

    next();
  };
};

module.exports = { authorize };

