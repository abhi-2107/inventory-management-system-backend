const { verifyToken } = require('../utils/auth');

const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }

  // Multi-tenant isolation: Attach user and organization context to the request
  c.set('user', {
    id: payload.userId,
    orgId: payload.orgId,
    role: payload.role,
  });

  await next();
};

module.exports = authMiddleware;
