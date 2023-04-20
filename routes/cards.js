const router = require('express').Router();
const {
  getCards,
  delCardsById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCards);
router.delete('/:cardId', auth, delCardsById);
router.post('/', auth, createCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
