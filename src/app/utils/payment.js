import Stripe from 'stripe';
import dotenv from 'dotenv'
dotenv.config()

export async function payment({
    payment_method_types = ["card"],
    mode = "payment",
    customer_email,
    metadata,
    success_url,
    cancel_url,
    line_items,
    discounts,
    stripe = new Stripe(process.env.stripe_sk)
}) {
     stripe = new Stripe(process.env.stripe_sk)
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        line_items,
        discounts
    })

    

    return session

}

