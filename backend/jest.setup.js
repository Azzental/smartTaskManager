const path = require('path');
const { PrismaClient } = require('@prisma/client');

process.env.NODE_ENV = 'test';
const dbPath = path.join(__dirname, 'prisma', 'test.db');
process.env.DATABASE_URL = `file:${dbPath}?connection_limit=1`;

jest.setTimeout(30000);

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error']
});

global.prisma = prisma;

beforeAll(async () => {
  console.log('Setting up test database...');
  
  try {
    await prisma.$connect();
    console.log('Test database connected');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
});

beforeAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});