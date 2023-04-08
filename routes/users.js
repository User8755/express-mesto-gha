const router = require("express").Router();
const {getUsers, getUsersById, createUsers} = require("../controllers/users")

router.get("/", getUsers);
router.get("/:userId", getUsersById);
router.post("/", createUsers);

module.exports = router;
