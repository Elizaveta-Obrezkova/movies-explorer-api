require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/auth');
const auth = require('./middlewares/auth');
const allErrors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

const allowedCors = [
  'https://elizabeth.diplom.nomoredomains.club',
  'http://elizabeth.diplom.nomoredomains.club',
  'localhost:3000',
  'https://localhost:3000',
  'http://localhost:3000',
];

const { NODE_ENV, PORT, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb');

const app = express();

app.use(requestLogger);

app.use((req, res, next) => {
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(authRouter);

app.use(auth);

app.use(usersRouter);

app.use(moviesRouter);

app.use((_, res, next) => {
  next(new NotFoundError('Запрос не может быть обработан. Неправильный путь.'));
});

app.use(errorLogger);

app.use(errors());

app.use(allErrors);

app.listen(PORT, () => {
  console.log(`Listening on port ${NODE_ENV === 'production' ? PORT : 3000}`);
});
