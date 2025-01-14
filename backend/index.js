const http2 = require('http2');
const express = require('express');
const app = express();
const { msgLogger } = require('./middlewares/logger');
require('dotenv').config({ path: ['.env', '.env.prob'] });
require('express-async-errors');

// we need to pass 'app' to startup/routes module(that is connected to port 3000)
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

// Promise.reject(new Error("unhandled rejection."));

// throw new Error('injecting uncaught exception');

// you can use an express method get(), to know what enviroment
msgLogger.info(`Environment - ${app.get('env')}`);
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => msgLogger.info(`Listening at port ${PORT}.`));
module.exports = server;