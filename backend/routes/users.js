const express = require('express');
const { User, validateUser, validateLogIn, validateUpdateUser } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const validObjectId = require('../middlewares/validObjectId');
const saltRounds = 10;
const auth = require('../middlewares/auth')
const sendVerificationEmail = require('../middlewares/mailer')
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const user = await User.find();
    res.status(200).send(user);
});


// validate email and send verification email
router.post('/validation', async (req, res) => {
    // validate the request body and check 400
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check existed user or not
    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(400).send('There is an account with this email.');

    // check mail system
    const result = await sendVerificationEmail(req.body.email)
    if (!result.success) {
        console.error('Detailed error:', result.error);

        if (result.error.message.includes('Invalid recipient') || result.error.message.includes('ENOTFOUND')) {
            return res.status(400).send('The provided email address is not valid or registered.');
        }
        return res.status(500).send('An error occurred while sending the verification email.');
    }
    res.status(200).send('Ok');
});

// verify email
router.get('/validation/mail', async (req, res) => {
    // const { token } = req.query;
    const { verificationKey } = req.query;

    if (verificationKey != 12345) return res.status(400).send('Invalid verification key.');

    res.status(200).send('Email verified!');
});


// register user
router.post('/create', async (req, res) => {
    // create user and hash user password
    const user = new User(req.body);
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    user.password = hashPassword;
    await user.save();

    res.status(200).send('Ok');
});

// login
router.post('/login', async (req, res) => {
    // validate email and password
    const { error } = validateLogIn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // find user by email and check 404
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send('No user found with this email.');

    // check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password');

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Send refresh token as an HttpOnly cookie, 
    /*  
        A cookie is a small piece of data that a web server sends to a user’s web browser. 
        The browser stores it and sends it back to the server with future requests. 
        Cookies are widely used to remember user preferences, manage sessions, and track user activity.

        res.cookie(name, value [, options]), https://expressjs.com/en/api.html#res.cookie
    */
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Flags the cookie to be accessible only by the web server.
        secure: process.env.NODE_ENV === 'production', // Ensure this is only over HTTPS in production
        sameSite: 'strict', //'strict': Prevents the cookie from being sent with cross-site requests (mitigates CSRF attacks).
    });

    // Send the access token in the response
    res.status(200).send({ accessToken });
});

// Token Refresh Route
router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).send({ error: 'No refresh token found' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.USER_REFRESH_KEY);
        const user = await User.findOne({ email: decoded.email })
        const accessToken = user.generateAccessToken();
        res.json({ accessToken });
    } catch (err) {
        res.status(403).send({ error: 'Invalid refresh token' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Make sure it’s only cleared over HTTPS in production
        sameSite: 'strict',
    });

    res.status(200).send({ success: 'Logged out successfully' });
});

// update data
router.put('/:id', [validObjectId, auth], async (req, res) => {
    // find user and check 404
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Not found the user');

    // if provided validate the payload 
    const { error } = validateUpdateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    // if not provided in the payload, add original
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password ? await bcrypt.hash(req.body.password, saltRounds) : user.password;

    await user.save();
    res.status(200).send(user);
})


// delete by admin (should pass [validObjectId, auth] )
router.delete('/:id', [validObjectId, auth], async (req, res) => {
    // find movie and check 404
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Not found the user');

    await user.deleteOne();
    res.status(200).send('User has been deleted');
})


// delete account
router.delete('/login/delete', async (req, res) => {
    // validate email and password
    const { error } = validateLogIn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // find user by email and check 404
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send('Not found user with this email');

    // check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password');

    // generate token
    await user.deleteOne();
    res.status(200).send('User has been deleted');
});

module.exports = router;