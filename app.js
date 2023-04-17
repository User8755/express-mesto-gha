const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./errors/errors');
const { createUsers, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '642da7678da1aacc2ff5c18e',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUsers);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Такой страници не существует' });
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
