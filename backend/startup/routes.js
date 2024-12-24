const express = require('express');
const movies = require('../routes/movies');
const genres = require('../routes/genres');
const users = require('../routes/users');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error = require('../middlewares/error');
const morgan = require('morgan');
const cors = require("cors"); // If your frontend and backend are running on different origins (e.g., different ports in development), make sure the backend is configured to handle CORS (Cross-Origin Resource Sharing). 

module.exports = function(app){
    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(morgan('tiny'));
    app.use(cors());

    app.use('/api/movies', movies);
    app.use('/api/genres', genres);
    app.use('/api/users', users);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use(error);
} 
