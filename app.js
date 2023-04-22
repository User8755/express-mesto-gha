require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { createUsers, login } = require('./controllers/users');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');
const NotFoundError = require('./errors/notfound');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUsers);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Такой страници не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
