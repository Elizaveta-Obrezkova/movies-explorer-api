const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllerrs/movies');

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)[-a-zA-Z0-9@:%_+.~#?&=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&=]*)?/).required(),
    trailerLink: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)[-a-zA-Z0-9@:%_+.~#?&=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&=]*)?/).required(),
    thumbnail: Joi.string().regex(/(http|https):\/\/([\w.]+\/?)[-a-zA-Z0-9@:%_+.~#?&=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&=]*)?/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.get('/movies', getMovies);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
