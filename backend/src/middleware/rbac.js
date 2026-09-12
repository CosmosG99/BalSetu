/**
 * RBAC middleware checking user roles
 * @param  {...string} allowedRoles - e.g. 'responder', 'admin', 'superadmin'
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const { role } = req.user;

    // Superadmin has access to everything
    if (role === 'superadmin' || allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: `Forbidden: role '${role}' lacks permission for this endpoint. Required: [${allowedRoles.join(', ')}]`
      }
    });
  };
}
