const mongoose = require('mongoose');
const { msgLogger } = require('../middlewares/logger');

module.exports = function () {
    let db = "mongodb://localhost:27017/dev_playground_node"
    if (process.env.NODE_ENV === 'production') {
        db = process.env.MONGO_URL;
    }

    mongoose.connect(db)
        .then(() => msgLogger.info(`Connects to ${db}`))
        .catch(err => msgLogger.error(err.message));
}