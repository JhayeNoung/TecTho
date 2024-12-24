const express = require('express');
const router = express.Router();
const {validateMovie, Movie} = require('../models/movie');
const {Genre, validateGenre} = require('../models/genre');
const validObjectId = require('../middlewares/validObjectId');
const auth = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');

router.get('/', async (req, res) => {
    // Use req.query.page to get the page number, defaulting to 1 if not provided
    const pageNumber = parseInt(req.query.page) || 1; // default to 1 for the first page
    const pageSize = parseInt(req.query.pageSize) || 6; // default to 6 if not provided

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * pageSize;

    // Retrieve the movies for the current page
    const movies = await Movie.find()
        .skip(skip) // skip the number of docs based on the page
        .limit(pageSize) // limit the number of docs to the specified page size
        .sort({ title: 1 });

    res.status(200).send(movies);
});

router.get('/:id', validObjectId, async (req,res)=>{
    // find by id and check 404
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Not found');

    // send the request
    res.status(200).send(movie);
});

router.post('/', auth, async (req,res)=>{
    // validate movie request and check 400
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find genre , and check 404
    let genre = await Genre.findById(req.body.genre);
    if(!genre) return res.status(404).send('No genre found');

    // find duplicate
    let movie_title = await Movie.findOne({title: req.body.title});
    if(movie_title) return res.status(400).send('Alreay have movie with this title.')

    // save movie
    const movie = new Movie(req.body);
    movie.genre = genre;
    await movie.save();

    res.status(200).send(movie);
});

router.put('/:id', [validObjectId, auth], async (req, res)=>{
    // find movie and check 404
    let movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Not found the movie');

    // found and update movie
    movie.title = req.body.title || movie.title;
    movie.genre = movie.genre;
    movie.numberInStock = req.body.numberInStock || movie.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate || movie.dailyRentalRate;
    movie.poster = req.body.poster || movie.poster;

    // if genere is provided
    if(req.body.hasOwnProperty("genre")){
        // validate genre id
        if(!mongoose.Types.ObjectId.isValid(req.body.genre))
            return res.status(400).send('Invalid genre Id.');
    
        // find genre if it is provided, and check 404
        const genre = await Genre.findById(req.body.genre);
        if(!genre) return res.status(404).send('No genre found');

        movie.genre = {
            _id: genre._id,
            name: genre.name,
        }
    }

    await movie.save();
    res.status(200).send(movie);
})

router.delete('/:id', [validObjectId, auth], async (req, res)=>{
    // find movie and check 404
    let movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Not found the movie');

    await movie.deleteOne();
    res.status(200).send('Movie has been deleted');
})

module.exports = router;