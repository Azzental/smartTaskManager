const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/appError');

exports.register = async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) return next(new AppError('Email and password required', 400));
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashedPw, name } });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    next(new AppError('Email already exists', 400));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid credentials', 401));
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};