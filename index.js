const express = require('express');
const cors = require('cors');
const stripe = require('stripe')("sk_test_51Q5TmSECmBLhb4FSYK5Y4ZcMyWTlygIkR6k1DexC3aXcURRCZtln5v8CvWGcFXIBhmfAa2KCsQliYwIs4mA6Et8Y00pVKL92uX");
const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout', async (req, res) => {
  const { items } = req.body;

  const line_items = items.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://lovely-valkyrie-d93c3a.netlify.app/success',
      cancel_url: 'https://lovely-valkyrie-d93c3a.netlify.app/failure',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(4982, () => {
  console.log('Server running on port 4982');
});