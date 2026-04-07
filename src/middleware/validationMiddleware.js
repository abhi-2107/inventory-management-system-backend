const { z } = require('zod');

const validate = (schema) => {
  return async (c, next) => {
    try {
      const body = await c.req.json();
      const result = schema.safeParse(body);
      
      if (!result.success) {
        return c.json({ 
          error: 'Validation failed', 
          details: result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        }, 400);
      }
      
      // Store validated data in context for controllers to use
      c.set('validData', result.data);
      await next();
    } catch (error) {
      return c.json({ error: 'Invalid JSON body' }, 400);
    }
  };
};

module.exports = validate;
