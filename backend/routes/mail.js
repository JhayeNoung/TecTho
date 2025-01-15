const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config')

router.get('/', async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, config.get('privateKey'));
        res.status(200).send('Email verified!');
    } catch (err) {
        res.status(400).send('Invalid or expired token.');
    }
});

module.exports = router;