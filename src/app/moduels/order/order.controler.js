import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { productModel } from "../../../db/models/product.model.js";
import { cartModel } from "../../../db/models/cart.model.js";
import { couponModel } from "../../../db/models/coupon.model.js";
import { orderModel } from "../../../db/models/order.model.js";
import { createInvoice } from "../../utils/pdf.js";
import main from "../../services/sendEmail.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";



export const createOrder = asyncHandler(async (req, res, next) => {
    
    let { productId, quantity, couponCode, address, phone, paymentMethod } = req.body

    if (couponCode) {
        let coupon = await couponModel.findOne({ code: couponCode.toLowerCase(), usedBy: { $nin: [req.user._id] } })
        
        if (!coupon || coupon.toDate < Date.now()) {
            return next(new AppError('coupon not found or alerdy used', 404))
        }
        req.body.coupon = coupon

    }

    let products = []


    if (productId) {
        products = [{ productId, quantity }]
    } else {
        let cartExist = await cartModel.findOne({ user: req.user._id })
        req.cart = cartExist
        if (!cartExist || !cartExist.products.length) {
            next(new AppError('cart is empty', 404))
        }
        products = cartExist.products
        if (!products.length) {
            next(new AppError('cart is empty', 404))
        }
    }

    let finalProducts = []
    for (const prod of products) {

        let product = await productModel.findOne({ _id: prod.productId, stock: { $gte: prod.quantity } })

        if (!product) {
            next(new AppError('product not found or out of stock', 404))
        }
        product.stock -= prod.quantity
        await product.save()
        let result = {
            title: product.title,
            productId: prod.productId,
            quantity: prod.quantity,
            price: product.price,
            finalPrice: product.subPrice * prod.quantity,
        }

        finalProducts.push(result)
    };



    let subPrice = finalProducts.reduce((acc, curr) => { return acc + curr.finalPrice }, 0)

    if (!productId) {
        req.cart.products = []
        await req.cart?.save()
    }

   

  

    const order = await orderModel.create({
        user: req.user._id,
        products: finalProducts,
        subPrice,
        couponId: req.body?.coupon?._id,
        discount: req.body?.coupon?.amount || 0,
        totalPrice: subPrice - (req.body.coupon ? (req.body.coupon.amount / 100 * subPrice) : 0),
        address,
        phone,
        paymentMethod,
        status: paymentMethod == 'cash' ? "placed" : "waitPayment"

    })

    req.data = { model: orderModel, id: order._id }


    const invoice = {
        shipping: {
            name: req.user.name,
            address: order.address,
            city: 'Agami',
            state: 'Alexandrea',
            country: "eg",
            postal_code: 25211
        },
        items: order.products,
        invoice_nr: order._id,
        subPrice: order.subPrice,
        total: order.totalPrice,
        discount: order.discount || 0
    };

    await createInvoice(invoice, "invoice.pdf");

    await main(req.user.email, `<h1>order placed</h1>`, "Fresh Cart E-commerce", [{
        path: "invoice.pdf",
        name: "invoice",
        contentType:'application/pdf'
    }])

    
    if(paymentMethod == 'card'){
        const stripe = new Stripe(process.env.stripe_sk)

        if (req.body?.coupon) {
            let copo = await stripe.coupons.create({
                name: req.body.coupon.code,
                percent_off: req.body.coupon.amount,
                duration: "once",
            })

            req.body.couponId = copo.id
            req.body.coupon?.usedBy.push(req.user._id)
            await req.body.coupon?.save()
        }

        let session = await payment({
            stripe,
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.user.email,
            metadata: { orderId: order._id.toString() },
            line_items: order.products.map((prod)=>{
                return {
                    price_data: {
                        currency: "egp",
                        unit_amount: prod.price*100,
                        product_data: {
                            name: prod.title,
                        },
                    },
                    quantity: prod.quantity,
                }   
            }),
            discounts: req.body.coupon ? [{coupon: req.body.couponId} ] : [],
            success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
            cancel_url:  `${req.protocol}://${req.headers.host}/order/cancel/${order._id}`
        })

        

        return res.status(200).json({ url: session.url , session})
    }


    if (req.body?.coupon) {
        req.body.coupon?.usedBy.push(req.user._id)
        await req.body.coupon?.save()
    }


   return res.status(201).json({ msg: 'order placed', order })
})


export const cancelOrder = asyncHandler(async (req, res, next) => {
    let { id } = req.params
    let { reason } = req.body
    let order = await orderModel.findOne({ _id: id, user: req.user._id })

    if (!order) {
        return next(new AppError('order not found', 404))
    }

    if (!["placed", "waitPayment"].includes(order.status)) {
        return next(new AppError('order cant be canceld', 502))
    }

    order.status = "canceled"
    order.canceldBy = req.user._id
    order.reason = reason
    await order.save()
    if (order.couponId) {
        let coupon = await couponModel.findByIdAndUpdate(order.couponId, { $pull: { usedBy: req.user._id } })

        if (coupon) {
            await coupon.save()
        }
    }

    for (const product of order.products) {
        let prod = await productModel.findById(product.productId)
        if (prod) {
            prod.stock += product.quantity
            await prod.save()
        }
    }


    res.json({ msg: 'done', order })
})

export const getOrder = asyncHandler(async (req, res, next) => {
    let { id } = req.params
    let order = await orderModel.findOne({ _id: id, user: req.user._id })

    if (!order) {
        return next(new AppError('order not found', 404))
    }

    res.status(200).json({ msg: 'done', order })
})

export const getCanceled = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    let orders = await orderModel.findOneAndUpdate({ _id:id , user: req.user._id } , {status: 'canceled' , canceldBy: req.user._id , reason: 'payment canceld'} , {new: true})
    res.status(200).json({ msg: 'done', orders })
})

export const deletOrder = asyncHandler(async (req, res, next) => {
    let { id } = req.params
    let order = await orderModel.findOneAndDelete({_id:id , user: req.user._id})
    res.status(200).json({ msg: 'done', order })
})



