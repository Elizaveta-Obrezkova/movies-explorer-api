const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  login,
  createUser,
  logout,
} = require('../controllerrs/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.get('/logout', logout);

module.exports = router;
