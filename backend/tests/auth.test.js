const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Auth API', () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testUser = {
    email: testEmail,
    password: 'password123',
    name: 'Test User'
  };

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@example.com'
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('message', 'User created');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123',
          name: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(10);
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});