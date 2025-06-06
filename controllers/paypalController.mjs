import {getAccessToken} from '../utils/paypalMethods.mjs';
import dotenv from 'dotenv';
dotenv.config();

export const createPaypalOrder = async (req, res) => {
    try {
        const { price, currency, description } = req.body;
        const accessToken = await getAccessToken();
        const orderResponse = await fetch(`${process.env.PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: currency || 'USD',
                        value: price || '99.00'
                    },
                    description: description || 'Payment for goods/services'
                }]
            }),
        });

        const orderData = await orderResponse.json();

        return res.json({id: orderData.id});
        
    } 
    catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
}



export const capturePaypalOrder = async (req, res) => {

    const { orderID } = req.body;
    const accessToken = await getAccessToken();

    const captureRes = await fetch(`${process.env.PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
         headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      throw new Error(JSON.stringify(captureData));
    }

    res.json(captureData);
}