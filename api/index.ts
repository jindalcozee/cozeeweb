import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Supabase backend client if env vars are present
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// API Routes
app.post("/api/create-order", async (req, res) => {
    try {
        const { amount } = req.body; // amount in INR

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: "Razorpay keys not configured on the server." });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise (smallest unit)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
});

app.post("/api/confirm-order", async (req, res) => {
    try {
        const orderData = req.body;
        const {
            email, firstName, lastName, phone, address, city, postalCode,
            cartItems, total, paymentMethod, discount, couponCode, razorpayOrderId, userId
        } = orderData;

        // 1. Save to Supabase
        if (supabase) {
            try {
                await supabase.from('orders').insert({
                    user_id: userId || null, // Allow null for guests
                    total_amount: total,
                    status: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
                    items: cartItems,
                    razorpay_order_id: razorpayOrderId || 'COD',
                    discount_amount: discount || 0,
                    coupon_code: couponCode || null,
                    // Attempt to save customer details if columns exist
                    customer_email: email,
                    customer_name: `${firstName} ${lastName}`,
                    customer_phone: phone,
                    shipping_address: `${address}, ${city}, ${postalCode}`
                });
                console.log("Order saved to Supabase (Backend)");
            } catch (dbError) {
                console.error("Failed to save order to Supabase:", dbError);
                // Proceed to email even if DB fails
            }
        }

        // 2. Send Emails via Nodemailer
        // If EMAIL_HOST is provided via environment, use that. Otherwise default to Google's SMTP.
        const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
        const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465;
        const secure = port === 465; 

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const itemsHtml = cartItems.map((item: any) => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.product.title}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.product.price}</td>
            </tr>
        `).join('');

        // Email 1: To the Admin (harsh@thecozee.in)
        const adminMailOptions = {
            from: `"Cozee Store" <${process.env.EMAIL_USER}>`,
            to: 'harsh@thecozee.in',
            subject: `New Order Received! (${paymentMethod === 'cod' ? 'COD' : 'Prepaid'}) - ${firstName} ${lastName}`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h1 style="color: #C11B17; text-align: center;">New Order from thecozee.in</h1>
                    ${paymentMethod === 'cod' ? `
                        <div style="background-color: #FFF5F5; border: 2px solid #C11B17; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                            <h2 style="color: #C11B17; margin: 0;">CASH ON DELIVERY ORDER</h2>
                            <p style="font-size: 18px; margin: 10px 0 0 0;"><strong>COLLECT ₹${total} FROM CUSTOMER</strong></p>
                        </div>
                    ` : ''}
                    <p style="font-size: 16px;"><strong>Customer:</strong> ${firstName} ${lastName}</p>
                    <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <h2 style="color: #C11B17;">Shipping Address</h2>
                    <p style="font-size: 16px; line-height: 1.5;">${address}<br />${city}, India<br />Postal Code: ${postalCode}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <h2 style="color: #C11B17;">Order Details</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f8f8f8;">
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                        <tfoot>
                            <tr style="background-color: #f8f8f8;">
                                <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>${paymentMethod === 'cod' ? 'Total (Collect at Delivery)' : 'Total Paid'}</strong>${couponCode ? `<br/><span style="font-size: 12px; color: #666;">Coupon: ${couponCode} (-₹${discount})</span>` : ''}</td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>${total} INR</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `,
        };

        // Email 2: To the Customer
        const customerMailOptions = {
            from: `"Cozee Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Thank you for your Cozee order! 💖`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h1 style="color: #C11B17; text-align: center;">You're Officialy Part of the Cozee Squad!</h1>
                    <p style="font-size: 16px;">Hi ${firstName},</p>
                    <p style="font-size: 16px;">Thank you for your order! We're currently packing up your Cozee items and getting them ready for shipping. We will notify you once your package is on its way.</p>
                    
                    ${paymentMethod === 'cod' ? `
                        <div style="background-color: #FFF5F5; border: 1px dashed #C11B17; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <p style="margin: 0; font-size: 16px;">You selected Cash on Delivery. Please keep <strong>₹${total}</strong> ready for when your package arrives.</p>
                        </div>
                    ` : ''}

                    <h2 style="color: #C11B17; margin-top: 30px;">Order Summary</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f8f8f8;">
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                    </table>
                    
                    <p style="margin-top: 30px; font-size: 16px;">If you have any questions, simply reply to this email!</p>
                    <p style="font-size: 16px;">Stay Warm,<br/><strong>The Cozee Team</strong></p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await Promise.all([
                transporter.sendMail(adminMailOptions),
                transporter.sendMail(customerMailOptions)
            ]);
            console.log("Both order confirmation emails sent successfully.");
        } else {
            console.warn("\n=== EMAIL CREDENTIALS MISSING ===");
            console.warn("Would have sent ADMIN email to harsh@thecozee.in for order by", email);
            console.warn("Would have sent CUSTOMER email to", email);
            console.warn("=================================\n");
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Confirmation processing error:", error);
        res.status(500).json({ error: "Failed to process order confirmation" });
    }
});

app.get("/api/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

export default app;
