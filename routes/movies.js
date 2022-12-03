const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllerrs/movies');

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)\S*/).required(),
    trailerLink: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)\S*/).required(),
    thumbnail: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)\S*/).required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.get('/', getMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
