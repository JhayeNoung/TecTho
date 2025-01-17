// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Qhz1cBn7sAkNs75GcSGBJ1l1Ppm7QTafxDUfwtp5wEWQro5qJwqugrXbtSgUsHI5TEAi7kTAkgj6qZMO5KfsV2e00t7GCkYoI');
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