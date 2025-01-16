const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config')
const { User, validateUser } = require('../models/user');
const sendVerificationEmail = require('../middlewares/mailer')

router.get('/verify', async (req, res) => {
    // const { token } = req.query;
    const { verificationKey } = req.query;

    if (verificationKey != 12345) return res.status(400).send('Invalid verification key.');

    res.status(200).send('Email verified!');
});


module.exports = router;