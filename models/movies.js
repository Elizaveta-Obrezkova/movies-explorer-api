const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('movie', movieSchema);
