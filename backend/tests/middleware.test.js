const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Middleware', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication middleware', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid token');
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

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Validation middleware', () => {
    it('should validate registration data', async () => {
      const invalidData = [
        { email: 'invalid-email', password: '123' },
        { email: 'test@example.com', password: '' },
        { email: '', password: 'password123' },
      ];

      for (const data of invalidData) {
        const response = await request(app)
          .post('/api/auth/register')
          .send(data)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      }
    });

    it('should validate task creation data', async () => {
      const testEmail = `validationtest${Date.now()}@example.com`;
      
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

      const invalidTask = {
        title: 'ab',
        status: 'invalid_status'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });
});