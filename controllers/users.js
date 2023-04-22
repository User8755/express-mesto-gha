/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DefaultError = require('../errors/default');
const BadRequestError = require('../errors/badrequest');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/notfound');
const Unauthorized = require('../errors/unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => { throw new DefaultError('Произошла ошибка'); })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .then((user) => {
      try {
        if (user) {
          res.send(user);
          return;
        }
        throw new NotFoundError('Карточка не найдена');
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь по ID не существует');
      }
    })
    .catch(next);
};

module.exports.getUsersСurrent = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      try {
        if (user) {
          res.send(user);
          return;
        }
        throw new NotFoundError('Карточка не найдена');
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь по ID не существует');
      }
    })
    .catch(next);
};

module.exports.createUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 4) // для тест пароль 4 символа
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email зарегистрирован');
      } else {
        throw new BadRequestError('Произошла ошибка, проверьте email и пароль');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пользователь не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Произошла ошибка, информация не обновлена');
      } else {
        throw new DefaultError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
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
        throw new BadRequestError('Неверно заполнены поля');
      } else {
        throw new DefaultError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Проверьте email и пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          if (!matched) {
            throw new BadRequestError('Проверьте email и пароль');
          }
          // не рекомендуют использовать куки в данном проекте, т.к. фронт расщитан на локалСторейдж
          // res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
          res.send({ token });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new Unauthorized('Проверьте email и пароль');
      } else {
        throw new Unauthorized('Проверьте email и пароль');
      }
    })
    .catch(next);
};
