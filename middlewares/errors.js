const mongoose = require('mongoose');

module.exports = (err, req, res, next) => {
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: 'Не корректный _id' });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: 'Ошибка валидации' });
    return;
  }
  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким Email уже зарегистрирован' });
    return;
  }
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};
