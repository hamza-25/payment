import express from 'express';
import stripe from '../config/stripeConfig.mjs';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { price, title, description, currency } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // includes Apple Pay and Google Pay automatically
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: title,
              description: description,
            },
            unit_amount: Math.round(parseInt(price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/success.html?info=${encodeURIComponent(JSON.stringify({price, title, description, currency}))}`,
      cancel_url: `${process.env.DOMAIN}/cancel.html?info=${encodeURIComponent(JSON.stringify({price, title, description, currency}))}`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the session.' });
  }
});


export default router;