const router = require('express').Router();
const Card = require('../models/card');

router.get('/', (req, res) => {
  Card.find({})
    .then(res => res.send({ data: res }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;