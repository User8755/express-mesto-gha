/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST, DEFAULT, NOT_FOUND,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь по ID не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Пользователь по ID не существует',
        });
      } else {
        res.status(DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 4)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь не создана' });
      } else {
        res.status(DEFAULT).send({ message: 'Произошла ошибка, проверьте email и пароль' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Произошла ошибка, информация не обновлена' });
      } else {
        res.status(DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неверно заполнены поля' });
      } else {
        res.status(DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(BAD_REQUEST).send({ message: 'Проверьте email и пароль' });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      if (!user) {
        res.status(BAD_REQUEST).send({ message: 'Проверьте email и пароль' });
      }
      res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send({ message: 'Успешно' });
    })
    .catch(() => {
      res.status(401).send({ message: 'Проверьте email и пароль' });
    });
};
