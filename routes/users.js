const router = require('express').Router();
const {
  getUsers, getUsersById, getUsersСurrent, updateProfile, updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationUpdateProfile, validationUpdateAvatar } = require('../middlewares/validation');

router.get('/', auth, getUsers);
router.get('/me', auth, getUsersСurrent);
router.get('/:userId', auth, getUsersById);
router.patch('/me', auth, validationUpdateProfile, updateProfile);
router.patch('/me/avatar', auth, validationUpdateAvatar, updateAvatar);

module.exports = router;
