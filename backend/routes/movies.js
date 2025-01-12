const express = require('express');
const router = express.Router();
const { validateMovie, Movie } = require('../models/movie');
const { Genre, validateGenre } = require('../models/genre');
const validObjectId = require('../middlewares/validObjectId');
const auth = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');
const { listObjects, generatePresignedUrl, generatePresignedDeleteUrl } = require('../middlewares/media')

router.get('/aws-api', async (req, res) => {
    try {
        // Fetching AWS
        const response = await listObjects('images')

        // concatenate your key to your bucket link
        const imageURIs = response.Contents
            .map((item) =>
                `https://${process.env.BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${item.Key}`)

        res.send(response)
    }
    catch (error) {
        res.send(`${error}`)
    }
});

router.post('/generate-presigned-url', async (req, res) => {
    const { fileName } = req.body;

    try {
        const url = await generatePresignedUrl(fileName);
        res.json({ url });

    } catch (error) {
        res.status(500).send(`${error}`);
    }

});

router.post('/generate-presigned-delete-url', async (req, res) => {
    const { fileName } = req.body;

    try {
        const url = await generatePresignedDeleteUrl(fileName);
        res.json({ url });

    } catch (error) {
        res.status(500).send(`${error}`);
    }
});

router.get('/', async (req, res) => {
    // Use req.query.page to get the page number, defaulting to 1 if not provided
    const page_number = parseInt(req.query.page) || 1; // default to 1 for the first page
    const page_size = parseInt(req.query.page_size) || 20; // default to 10 if not provided
    const genreId = req.query.genre || null;
    const search = req.query.search || null;
    const ordering = req.query.ordering || 'title'; // Default to ordering by title
    const skip = (page_number - 1) * page_size; // Calculate the number of documents to skip

    // Validate genreId if provided
    if (genreId) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) return res.status(400).send("Invalid Object Id")

        var genre = await Genre.findById(genreId)
        if (!genre) return res.status(404).send("No genre with this Id")
    }

    // Build filter object
    const query = {};

    if (genreId) {
        query['genre._id'] = genreId;
    }

    if (search) {
        query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // Map ordering parameter to database fields
    const sortOptions = {};
    if (ordering === 'title') {
        sortOptions.title = 1; // Ascending order
    } else if (ordering === '-title') {
        sortOptions.title = -1; // Descending order
    } else if (ordering === 'numberInStock') {
        sortOptions.numberInStock = 1; // Ascending order
    } else if (ordering === '-numberInStock') {
        sortOptions.numberInStock = -1; // Descending order
    }
    else if (ordering === 'dailyRentalRate') {
        sortOptions.dailyRentalRate = 1; // Ascending order
    }
    else if (ordering === '-dailyRentalRate') {
        sortOptions.dailyRentalRate = -1; // Descending order
    }

    // Retrieve the total number of movies
    const count = await Movie.countDocuments();

    // Retrieve the movies for the current page
    const results = await Movie.find(query)
        .skip(skip) // skip the number of docs based on the page
        .limit(page_size) // limit the number of docs to the specified page size
        .sort(sortOptions);

    res.status(200).send({ count, page_size, results, sortOptions });
});


router.get('/:id', validObjectId, async (req, res) => {
    // find by id and check 404
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Not found');

    // send the request
    res.status(200).send(movie);
});

router.post('/', auth, async (req, res) => {
    // validate movie request and check 400
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // find genre , and check 404
    let genre = await Genre.findById(req.body.genre);
    if (!genre) return res.status(404).send('No genre found');

    // find duplicate
    let movie_title = await Movie.findOne({ title: req.body.title });
    if (movie_title) return res.status(400).send('Already have movie with this title.')

    // save movie
    const movie = new Movie(req.body);
    movie.genre = genre;

    await movie.save();

    res.status(200).send(movie);
});

router.put('/:id', [validObjectId, auth], async (req, res) => {
    // find movie and check 404
    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Not found the movie');

    // found and update movie
    movie.title = req.body.title || movie.title;
    movie.genre = movie.genre;
    movie.numberInStock = req.body.numberInStock || movie.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate || movie.dailyRentalRate;
    movie.poster = req.body.poster || movie.poster;

    // if genere is provided
    if (req.body.hasOwnProperty("genre")) {
        // validate genre id
        if (!mongoose.Types.ObjectId.isValid(req.body.genre))
            return res.status(400).send('Invalid genre Id.');

        // find genre if it is provided, and check 404
        const genre = await Genre.findById(req.body.genre);
        if (!genre) return res.status(404).send('No genre found');

        movie.genre = {
            _id: genre._id,
            name: genre.name,
        }
    }

    await movie.save();
    res.status(200).send(movie);
})

router.delete('/:id', [validObjectId, auth], async (req, res) => {
    // find movie and check 404
    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Not found the movie');

    await movie.deleteOne();
    res.status(200).send('Movie has been deleted');
})

module.exports = router;