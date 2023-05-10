const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badrequest');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/notfound');
const Unauthorized = require('../errors/unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Неверный Id'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по ID не существует'));
      } else {
        next(err);
      }
    });
};

module.exports.getUsersСurrent = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по ID не существует'));
      } else {
        next(err);
      }
    });
};

module.exports.createUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 4) // для теста пароль 4 символа
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка, проверьте email и пароль'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Пользователь не найдена'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка, информация не обновлена'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Проверьте email и пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          if (!matched) {
            throw new Unauthorized('Проверьте email и пароль');
          }
          // не рекомендуют использовать куки в данном проекте, т.к. фронт расщитан на локалСторейдж
          // res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
          res.send({ token });
        });
    })
    .catch((err) => {
      next(err);
    });
};
