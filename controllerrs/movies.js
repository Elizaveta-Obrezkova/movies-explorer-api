const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-err');
const NoAccessError = require('../errors/no-access-err');

const createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    thumbnail: req.body.thumbnail,
    owner: req.user._id,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch(next);
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((movie) => {
      if (!JSON.stringify(movie.owner).includes(req.user._id)) {
        throw new NoAccessError('Недостаточно прав для удаления чужой карточки');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((deletemovie) => {
          res.send(deletemovie);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
