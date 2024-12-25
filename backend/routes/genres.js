const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genre');
const validObjectId = require('../middlewares/validObjectId');
const auth = require('../middlewares/auth');

router.get('/', async (req,res)=>{
    // Use req.query.page to get the page number, defaulting to 1 if not provided
    const page_number = parseInt(req.query.page) || 1; // default to 1 for the first page
    const page_size = parseInt(req.query.page_size) || 5; // default to 6 if not provided

    // Calculate the number of documents to skip
    const skip = (page_number - 1) * page_size;

    // Retrive the total number of genres
    const count = await Genre.countDocuments();

    // Retrieve the movies for the current page
    const results = await Genre.find()
        .skip(skip) // skip the number of docs based on the page
        .limit(page_size) // limit the number of docs to the specified page size
        .sort({ name: 1 });

    res.status(200).send({count, page_size, results});
});

router.get('/:id', validObjectId, async (req,res)=>{
    // find by id and check 404
    const genres = await Genre.findById(req.params.id);
    if(!genres) return res.status(404).send('No genre with this id');

    res.status(200).send(genres);
});

router.post('/', auth, async (req, res)=>{
    // check 401 and 403

    // check validation 400
    let {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find duplicate
    let genre_name = await Genre.findOne({name: req.body.name.toLowerCase()});
    if(genre_name) return res.status(400).send('Already have with this name.');

    const genre = await Genre.create({name: req.body.name.toLowerCase()});
    await genre.save();

    res.status(200).send(genre);
});

router.put('/:id', [validObjectId,auth], async (req, res)=>{
    // check valid id(400), check 401 and 403
    // validate genre check 400
    let {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check item 404
    let genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('No genre with this id');

    // update item
    genre.name = req.body.name;
    await genre.save();
    res.status(200).send('Genre has been updated');
})

router.delete('/:id', [validObjectId,auth], async (req, res)=>{
    // check valid id(400), check 401 and 403

    // check item 404
    let genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('No genre with this id');

    // update item
    await genre.deleteOne();
    res.status(200).send('Genre has been deleted');
})

module.exports = router;