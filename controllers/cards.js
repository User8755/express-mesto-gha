const Card = require('../models/card');
const DefaultError = require('../errors/default');
const BadRequestError = require('../errors/badrequest');
const NotFoundError = require('../errors/notfound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.delCardsById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((reqCard) => {
      const owner = req.user._id;
      const ownerCard = reqCard.owner;
      if (ownerCard.toString() === owner) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            res.send({ data: card });
          });
      } else {
        throw new BadRequestError('Это не ваша карточка');
        // res.status(BAD_REQUEST).send({ message: 'Это не ваша карточка' });
      }
    })
    .catch(() => {
      throw new DefaultError('Произошла ошибка');
      // res.status(DEFAULT).send({ message: 'Произошла ошибка' });
    })
    .catch(next);
  // Card.findByIdAndRemove(req.params.cardId)
  //   .then((card) => {
  //     console.log(card);
  //     if (!card) {
  //       res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
  //     } else {
  //       res.send({ data: card });
  //     }
  //   })
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
  //     } else {
  //       res.status(DEFAULT).send({ message: 'Произошла ошибка' });
  //     }
  //   });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Карточка не создана');
        // res.status(BAD_REQUEST).send({ message: 'Карточка не создана' });
      } else {
        throw new DefaultError('Произошла ошибка');
        // res.status(DEFAULT).send({ message: 'Произошла ошибка' });
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
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
        // res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный Id');
        // res.status(BAD_REQUEST).send({ message: 'Некорректный Id' });
      } else {
        throw new DefaultError('Произошла ошибка');
        // res.status(DEFAULT).send({ message: 'Произошла ошибка' });
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
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
        // res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный Id');
        // res.status(BAD_REQUEST).send({ message: 'Некорректный Id' });
      } else {
        throw new DefaultError('Произошла ошибка');
        // res.status(DEFAULT).send({ message: 'Произошла ошибка' });
      }
    })
    .catch(next);
};
