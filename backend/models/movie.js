const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 300,
        required: true,
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 300,
        require: true,
    },
    poster_url: {
        type: String,
        min: 1,
        require: true,
    },
    video_url: {
        type: String,
        min: 1,
        require: true,
    },
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        genre: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(300).required(),
        dailyRentalRate: Joi.number().min(0).max(300).required(),
        poster_url: Joi.string().min(1).required(),
        video_url: Joi.string().min(1).required(),
    });

    return schema.validate(movie);
}

exports.validateMovie = validateMovie;
exports.Movie = Movie;
exports.movieSchema = movieSchema;
