const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    // authentication  
    try {
        const token = req.header('Authorization');

        if (!token) return res.status(401).send({ message: 'Lack of valid authentication credentials' })

        // authorization
        const decoded = jwt.verify(token, process.env.USER_ACCESS_KEY);
        if (!decoded.isAdmin) return res.status(403).send({ message: 'Forbidden. You have no authorize.' });

        // for testing
        req.test = decoded;

        next();
    }
    catch (error) {
        res.status(400).send(error);
    }
};

