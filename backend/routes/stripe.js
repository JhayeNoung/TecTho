// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_TEST_PRIVATE_KEY);
const express = require('express');
const router = express.Router();

const YOUR_DOMAIN = 'http://localhost:5173/payment';

router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'price_1QiC8fBn7sAkNs75MkTUZZin',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
});

module.exports = router;