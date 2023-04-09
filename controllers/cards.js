const Card = require("../models/card");
const { BAD_REQUEST, DEFAULT, NOT_FOUND, RES_OK } = require("../errors/errors");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(RES_OK).send({ data: card }))
    .catch(() => res.status(NOT_FOUND).send({ message: "Произошла ошибка" }));
};

module.exports.delCardsById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      }
      res.status(RES_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Карточка не найдена" });
      }
      res.status(DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(RES_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: "Карточка не создана" });
      }
      res.status(DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Картачка не найдена" });
        return;
      }
      res.status(DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Карточка не найдена" });
        return;
      }
      res.status(DEFAULT).send({ message: "Произошла ошибка" });
    });
};
