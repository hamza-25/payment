import express from 'express';
import stripe from '../config/stripeConfig.mjs'; // Adjust the path as necessary

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // includes Apple Pay and Google Pay automatically
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
              description: 'Testing multiple payment methods',
            },
            unit_amount: 999, // $19.99
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:8000/success.html',
      cancel_url: 'http://localhost:8000/cancel.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the session.' });
  }
});


export default router;