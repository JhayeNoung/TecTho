const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blacklion262000@gmail.com',
        pass: process.env.APP_PASSWORD, // Use app password, not your main password
    },
});


const sendVerificationEmail = async (email) => {
    try {
        // const token = jwt.sign({ key: email }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
        // const verificationKey = crypto.randomInt(100000, 999999); // Generate a 6-digit key
        const verificationKey = 12345
        const mailOptions = {
            from: 'blacklion262000@gmail.com',
            to: email,
            subject: 'Verify Your Email',
            // text: `Click the link to verify your email: http://process.env.DOMAIN_ADDRESS/verify?token=${token}`,
            text: `Your verification key is: ${verificationKey}`,
        };
        await transporter.sendMail(mailOptions);

        return { success: true };
    }
    catch (error) {
        return { success: false, error: error };
    }
};

module.exports = sendVerificationEmail