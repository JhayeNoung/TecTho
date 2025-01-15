const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blacklion262000@gmail.com',
        pass: 'pdbl sfss tegb qyfr', // Use app password, not your main password
    },
});


const sendVerificationEmail = async (email) => {
    try {
        const token = jwt.sign({ key: email }, config.get('privateKey'), { expiresIn: '1h' });
        const mailOptions = {
            from: 'blacklion262000@gmail.com',
            to: email,
            subject: 'Verify Your Email',
            text: `Click the link to verify your email: http://localhost:3001/api/verify?token=${token}`,
        };
        await transporter.sendMail(mailOptions);

        return { success: true };
    }
    catch (error) {
        return { success: false, error: error };
    }
};

module.exports = sendVerificationEmail