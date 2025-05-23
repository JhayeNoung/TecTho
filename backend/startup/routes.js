const express = require('express');
const movies = require('../routes/movies');
const genres = require('../routes/genres');
const users = require('../routes/users');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error = require('../middlewares/error');
const aws = require('../routes/aws');
const stripe = require('../routes/stripe');
const morgan = require('morgan');
const cors = require("cors"); // If your frontend and backend are running on different origins (e.g., different ports in development), make sure the backend is configured to handle CORS (Cross-Origin Resource Sharing). 
const cookieParser = require('cookie-parser');

module.exports = function (app) {
    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', true); // Trust proxy for Nginx SSL forwarding
        app.use((req, res, next) => {  // Force HTTPS redirect
            if (req.headers['x-forwarded-proto'] !== 'https') {
                return res.redirect(`https://${req.headers.host}${req.url}`);
            }
            next();
        });
    }

    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://www.tectho.com',
        'https://tectho.com',
        'https://api.tectho.com',
        process.env.DOMAIN_ADDRESS,
    ];

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or CURL requests)
            if (!origin) return callback(null, true);

            // Check if the request's origin is in the allowed origins array
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                // If not, reject the request with an error
                return callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Add this if you're using cookies
    }));

    // app.options('*', cors()); // Preflight request handling

    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('tiny'));
    app.use(cookieParser());

    app.use('/api/movies', movies);
    app.use('/api/genres', genres);
    app.use('/api/users', users);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use('/api/presigned-url', aws);
    app.use('/api/stripe', stripe);
    app.use(error);
} 
