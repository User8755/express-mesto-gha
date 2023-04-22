/* eslint-disable import/no-extraneous-dependencies */
const { celebrate, Joi } = require('celebrate');

// аутенфикация
module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// авторизация
module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// обновление данных пользователя
module.exports.validationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});
// обновление аватара
module.exports.validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});
// поиск по ID
module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});
// создание карточки
module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
});
// поиск карточки по Id
module.exports.validationCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});
