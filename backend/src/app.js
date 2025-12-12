const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');
const AppError = require('./utils/appError');
const swaggerDocument = YAML.load('./swagger.yaml');

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


const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('*', (req, res, next) => next(new AppError('Route not found', 404)));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
module.exports = app;