const request = require('supertest');
const app = require('../src/app');

const prisma = global.prisma;

describe('Tasks API', () => {
  let authToken;
  let userId;
  let testTaskId;

  beforeAll(async () => {
    const testEmail = `tasktest${Date.now()}@example.com`;
    
    await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'password123',
        name: 'Task Test User'
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'password123'
      });

    authToken = loginResponse.body.token;
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    userId = user.id;
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return tasks for authenticated user', async () => {
      await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          authorId: userId
        }
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title', 'Test Task');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task Description',
        status: 'todo',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.authorId).toBe(userId);

      testTaskId = response.body.id;
    });

    it('should return 400 for invalid task data', async () => {
      const invalidTask = {
        description: 'Task without title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return task by ID', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Get Task Test',
          description: 'Description',
          authorId: userId
        }
      });

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Get Task Test');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 for task of another user', async () => {
      const otherUser = await prisma.user.create({
        data: {
          email: `other${Date.now()}@example.com`,
          password: 'password123',
          name: 'Other User'
        }
      });

      const otherTask = await prisma.task.create({
        data: {
          title: 'Other User Task',
          authorId: otherUser.id
        }
      });

      const response = await request(app)
        .get(`/api/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');

      await prisma.task.delete({ where: { id: otherTask.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Original Title',
          description: 'Original Description',
          authorId: userId
        }
      });

      const updatedData = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'completed'
      };

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.status).toBe('completed');
      expect(response.body.description).toBe('Updated Description');
    });

    it('should return 404 when updating non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Task to Delete',
          authorId: userId
        }
      });

      await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id }
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });
});