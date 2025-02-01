const mongoose = require('mongoose');
const { msgLogger } = require('../middlewares/logger');

module.exports = function () {
    const db = process.env.MONGO_URL;
    mongoose.connect(db)
        .then(() => msgLogger.info(`Connects to ${db}`))
        .catch(err => msgLogger.error(err.message));
}


