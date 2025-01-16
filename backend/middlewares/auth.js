const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    // authentication
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Lack of valid authentication credentials ');

    // authorization
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.isAdmin) return res.status(403).send('Forbidden. You have no authorize.');

    // for testing
    req.test = decoded;

    next();
};

