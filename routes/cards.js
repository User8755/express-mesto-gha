const router = require("express").Router();
const {getCards, delCardsById, createCard, likeCard, dislikeCard} = require("../controllers/cards")

router.get("/", getCards);
router.delete("/:cardId", delCardsById);
router.post("/", createCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
