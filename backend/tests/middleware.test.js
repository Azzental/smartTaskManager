const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Middleware', () => {
  describe('Authentication middleware', () => {
    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });

    it('should allow access with valid token', async () => {
      const testEmail = `middlewaretest${Date.now()}@example.com`;
      
      await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'password123'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'password123'
        });

      const token = loginResponse.body.token;

      await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Validation middleware', () => {
    it('should validate registration data', async () => {
      const invalidData = [
        { email: 'invalid-email', password: '123' }, // Неверный email, короткий пароль
        { email: 'test@example.com', password: '' }, // Пустой пароль
        { email: '', password: 'password123' }, // Пустой email
      ];

      for (const data of invalidData) {
        await request(app)
          .post('/api/auth/register')
          .send(data)
          .expect(400);
      }
    });
  });
});