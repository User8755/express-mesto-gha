const User = require("../models/user");
const { BAD_REQUEST, DEFAULT, NOT_FOUND, RES_OK } = require("../errors/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(RES_OK).send({ data: user }))
    .catch(() => res.status(DEFAULT).send({ message: "Произошла ошибка" }));
};

module.exports.getUsersById = (req, res) => {
  console.log(req.params);
  User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Пользователь по ID не найден" });
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Пользователь по ID не существует",
        });
      }
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND).send({
          message: "Пользователь не найден",
        });
      }
      res.status(DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(RES_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Пользователь не создана" });
      }
      res.status(DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true }
  )
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: "Пользователь не найдена" });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(NOT_FOUND).send({ message: "Пользователь не найдена" });
      return;
    }
    res.status(DEFAULT).send({ message: "Произошла ошибка" });
  });
};

module.exports.updateAvatar = (req, res) => {
  console.log(req);
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      es.status(RES_OK).send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
