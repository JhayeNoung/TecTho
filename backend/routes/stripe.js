// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_TEST_PRIVATE_KEY);
const express = require('express');
const router = express.Router();

const YOUR_DOMAIN = 'http://localhost:5173/payment';

router.post('/create-checkout-session', async (req, res) => {
    const movie = JSON.parse(req.body.movie); // Parse the incoming JSON string to object

    const product = await stripe.products.create({
        name: movie.title,
    });

    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: movie.dailyRentalRate * 100,
        currency: 'usd',
    });

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: price.id,
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