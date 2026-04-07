const roleMiddleware = (allowedRoles) => {
  return async (c, next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ 
        error: `Forbidden: You need one of these roles: ${allowedRoles.join(', ')}` 
      }, 403);
    }

    await next();
  };
};

module.exports = roleMiddleware;
