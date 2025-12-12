const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

router.use(authenticate);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate('task'), taskController.createTask);
router.put('/:id', validate('task'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;