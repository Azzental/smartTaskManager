const yup = require('yup');

const schemas = {
  register: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    name: yup.string().optional(),
  }),
  login: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  }),
  task: yup.object({
    title: yup.string().min(3).required(),
    description: yup.string().optional(),
    status: yup.string().oneOf(['todo', 'in_progress', 'completed']).optional(),
    priority: yup.string().oneOf(['low', 'medium', 'high']).optional(),
    deadline: yup.date().optional(),
  }),
};

const validate = (type) => async (req, res, next) => {
  try {
    await schemas[type].validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};

module.exports = validate;