const express = require('express');
const { Rental , validateRental, rentalSchema} = require('../models/rental');
const router = express.Router();
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');
const { Customer } = require('../models/customer');
const { default: mongoose } = require('mongoose');
const { Movie } = require('../models/movie');

router.get('/', async(req,res)=>{
    const rentals = await Rental.find();
    res.status(200).send(rentals);
});

router.post('/', auth, async(req,res)=>{
    // validate rental 400
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find customer 404 
    const customer = await Customer.findById(req.body.customer);
    if(!customer) return res.status(404).send('No customer with this id.');

    // find movie 404
    const movie = await Movie.findById(req.body.movie);
    if(!movie) return res.status(404).send('No movie with this id.');

    // check customer already rented
    let rental = await Rental.findOne({
        'customer._id': req.body.customer,
        'movie._id': req.body.movie,
    })
    if(rental) return res.status(400).send('You have already rented this movie.');

    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Start the transaction

    try{
        // decrease movie stock
        movie.numberInStock = (movie.numberInStock-1);
        
        // post
        rental = new Rental({
            customer: customer,
            movie: movie,
        })
    
        await movie.save();
    
        await rental.save();

        // If everything is fine, commit the transaction
        await session.commitTransaction();
        session.endSession(); // End the session after 

        res.status(200).send(rental);
    } catch(error){
        // If an error occurs, rollback the transaction
        await session.abortTransaction();
        session.endSession(); // End the session after aborting

        res.status(500).json({ error: 'Transaction failed!', details: error });
    }

})

router.delete('/', auth, async(req,res)=>{
    // validate rental 400
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find customer 404 
    const customer = await Customer.findById(req.body.customer);
    if(!customer) return res.status(404).send('No customer with this id.');

    // find movie 404
    const movie = await Movie.findById(req.body.movie);
    if(!movie) return res.status(404).send('No movie with this id.');

    // check customer already rented 
    let rental = await Rental.findOne({
        'customer._id': req.body.customer,
        'movie._id': req.body.movie,
    })
    if(!rental) return res.status(404).send('No rental with these infos.');

    await rental.deleteOne();

    res.status(200).send('Rental has been deleted successfully.');

})

module.exports = router;