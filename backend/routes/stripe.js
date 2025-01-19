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
        line_items: [{
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price_data: {
                currency: price.currency,
                unit_amount: price.unit_amount,
                product_data: {
                    name: product.name,
                    images: [movie.poster_url],
                    description: "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst."
                }
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
});

module.exports = router;