const Card = require('../models/card');
const BadRequestError = require('../errors/badrequest');
const NotFoundError = require('../errors/notfound');
const ForbiddenError = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.delCardsById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((reqCard) => {
      if (!reqCard) {
        throw new NotFoundError('Некорректный Id');
      }
      if (reqCard.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            res.send({ data: card });
          });
      } else {
        next(new ForbiddenError('Это не ваша карточка'));
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Карточка не создана'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный Id'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный Id'));
      } else {
        next(err);
      }
    });
};
