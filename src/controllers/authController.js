const authService = require('../services/authService');

class AuthController {
  async signup(c) {
    try {
      const body = c.get('validData');
      const result = await authService.signup(body);
      return c.json({
        message: 'Signup successful',
        ...result,
      }, 201);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async login(c) {
    try {
      const { email, password } = c.get('validData');
      const result = await authService.login(email, password);
      return c.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error) {
      return c.json({ error: error.message }, 401);
    }
  }
}

module.exports = new AuthController();
