const Card = require('../models/card');
const DefaultError = require('../errors/default');
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
      if (reqCard.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            res.send({ data: card });
          });
      } else {
        const forbidden = new ForbiddenError('Это не ваша карточка');
        next(forbidden);
      }
    })
    .catch(() => {
      throw new NotFoundError('Некорректный Id');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Карточка не создана');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      try {
        if (card) {
          res.send(card);
          return;
        }
        throw new NotFoundError('Карточка не найдена');
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный Id');
      } else {
        throw new DefaultError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      try {
        if (card) {
          res.send(card);
          return;
        }
        throw new NotFoundError('Карточка не найдена');
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный Id');
      } else {
        throw new DefaultError('Произошла ошибка');
      }
    })
    .catch(next);
};
