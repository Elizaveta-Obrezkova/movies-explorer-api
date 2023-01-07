const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').orFail(new AuthError('Неправильное email или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthError('Неправильное email или пароль'));
            return;
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'None',
              secure: true,
            });
          res.status(200).send({ user, massage: 'Авторизация прошла успешно' });
        })
        .catch(next);
    })
    .catch(next);
}

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((newUser) => {
      res.send(newUser);
    })
    .catch(next);
};

function logout(req, res) {
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.status(200).send({ massage: 'Вы успешно вышли' });
}

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUser,
  logout,
};
