const router = require('express').Router();

const {
  getCards,
  delCardsById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { validationCreateCard, validationCardById } = require('../middlewares/validation');

router.get('/', auth, getCards);
router.delete('/:cardId', auth, validationCardById, delCardsById);
router.post('/', auth, validationCreateCard, createCard);
router.put('/:cardId/likes', auth, validationCardById, likeCard);
router.delete('/:cardId/likes', auth, validationCardById, dislikeCard);

module.exports = router;
