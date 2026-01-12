const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/appError');

exports.getAllTasks = async (req, res, next) => {
  const { status } = req.query;
  const where = { authorId: req.user.id };
  if (status) where.status = status;
  try {
    const tasks = await prisma.task.findMany({ where });
    res.json(tasks);
  } catch (err) { 
    next(err); 
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { 
        id: req.params.id,
        authorId: req.user.id 
      },
    });
    if (!task) return next(new AppError('Task not found', 404));
    res.json(task);
  } catch (err) { 
    next(err); 
  }
};

exports.createTask = async (req, res, next) => {
  const { title, description, status, priority, deadline } = req.body;
  if (!title) return next(new AppError('Title required', 400));
  try {
    const task = await prisma.task.create({
      data: { 
        title, 
        description, 
        status: status || 'todo',
        priority: priority || 'medium', 
        deadline: deadline ? new Date(deadline) : null, 
        authorId: req.user.id 
      },
    });
    res.status(201).json(task);
  } catch (err) { 
    next(err); 
  }
};

exports.updateTask = async (req, res, next) => {
  const data = req.body;
  
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });
  
  if (data.deadline) {
    data.deadline = new Date(data.deadline);
  }
  
  try {
    const task = await prisma.task.update({
      where: { 
        id: req.params.id, 
        authorId: req.user.id 
      },
      data,
    });
    res.json(task);
  } catch (err) { 
    if (err.code === 'P2025') {
      return next(new AppError('Task not found', 404));
    }
    next(err); 
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await prisma.task.delete({
      where: { 
        id: req.params.id, 
        authorId: req.user.id 
      },
    });
    res.json({ message: 'Task deleted' });
  } catch (err) { 
    if (err.code === 'P2025') {
      return next(new AppError('Task not found', 404));
    }
    next(err); 
  }
};