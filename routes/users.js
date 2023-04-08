const router = require("express").Router();
const {getUsers, getUsersById, createUsers, updateProfile, updateAvatar} = require("../controllers/users")

router.get("/", getUsers);
router.get("/:userId", getUsersById);
router.post("/", createUsers);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

module.exports = router;