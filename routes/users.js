const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;
