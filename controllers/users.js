const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUsersById = (req, res) => {
  console.log(req.params);
  User.findById({_id:req.params.userId})
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.updateAvatar = (req, res) => {
  console.log(req);
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
