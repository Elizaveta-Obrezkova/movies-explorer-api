const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUserInfo,
  updateUser,
} = require('../controllerrs/users');

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
