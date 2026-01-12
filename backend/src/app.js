const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');
const AppError = require('./utils/appError');

let swaggerDocument;
try {
  swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
} catch (err) {
  console.warn('Swagger documentation not found, API docs will not be available');
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'task-manager-api'
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  const statusCode = err.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(err.errors && { details: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;