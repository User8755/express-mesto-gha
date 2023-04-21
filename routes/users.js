const router = require('express').Router();
const {
  getUsers, getUsersById, updateProfile, updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
// router.get('/:userId', auth, getUsersById);
router.get('/me', auth, getUsersById);
router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
