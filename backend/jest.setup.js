const path = require('path');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

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
  log: ['error', 'warn']
});

global.prisma = prisma;

beforeAll(async () => {
  console.log('Setting up test database...');
  
  try {
    
    await prisma.$connect();
    
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Task" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'todo',
        "priority" TEXT NOT NULL DEFAULT 'medium',
        "deadline" DATETIME,
        "authorId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    
    // await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
    
    console.log('Test database setup completed');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});


afterAll(async () => {
  try {
    await prisma.$executeRawUnsafe('DELETE FROM Task');
    await prisma.$executeRawUnsafe('DELETE FROM User');
    await prisma.$disconnect();
  } catch (error) {}
});