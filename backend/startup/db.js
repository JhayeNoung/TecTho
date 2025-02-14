const mongoose = require('mongoose');
const { msgLogger } = require('../middlewares/logger');

module.exports = function () {
    let db;
    if (process.env.NODE_ENV === 'test') {
        db = process.env.MONGO_URL_TEST;
    } else if (process.env.NODE_ENV === 'production') {
        db = process.env.MONGO_URL;
    } else {
        db = process.env.MONGO_URL_DEV;
    }

    mongoose.connect(db)
        .then(() => msgLogger.info(`Connects to ${db}`))
        .catch(err => msgLogger.error(err.message));
}


