import { Router } from 'express'
import Stripe from 'stripe'
import { protect } from '../middleware/auth.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, packageName } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { packageName, userId: req.user._id.toString() },
    })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    if (event.type === 'payment_intent.succeeded') {
      console.log('Payment succeeded:', event.data.object.id)
      // TODO: create project, send confirmation email
    }
    res.json({ received: true })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
