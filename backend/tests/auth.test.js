const request = require('supertest');
const app = require('../src/app');

const prisma = global.prisma;

describe('Auth API', () => {
  const getTestEmail = () => `test${Date.now()}${Math.random()}@example.com`;
  const testUser = {
    email: getTestEmail(),
    password: 'password123',
    name: 'Test User'
  };

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
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const testCorrectUser = {
    email: 'correctmail@example.com',
    password: 'correct123',
    name: 'Test Correct User'
    };

    

    it('should login with valid credentials', async () => {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testCorrectUser)
        .expect(201);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCorrectUser.email,
          password: testCorrectUser.password
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