import stripe from '../config/stripeConfig.mjs';
import dotenv from 'dotenv';
dotenv.config();

export const createCheckoutSession = async (req, res) => {
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
      success_url: `https://payment-dwh4.onrender.com/success.html?info=${encodeURIComponent(JSON.stringify({price, title, description, currency}))}`,
      cancel_url: `https://payment-dwh4.onrender.com/cancel.html?info=${encodeURIComponent(JSON.stringify({price, title, description, currency}))}`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the session.' });
  }
}