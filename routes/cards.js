const router = require("express").Router();
const {getCards, delCardsById, createCard} = require("../controllers/cards")

router.get("/", getCards);
router.delete("/:cardId", delCardsById);
router.post("/", createCard);


module.exports = router;
