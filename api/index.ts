import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
        const { email, firstName, lastName, phone, address, city, postalCode, cartItems, total, paymentMethod } = orderData;

        // Use environment variables for SMTP configuration
        // Recommended: Use a service like Resend or Gmail App Password
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.office365.com', // Default to Outlook/O365
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
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

        const mailOptions = {
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
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #f8f8f8;">
                                <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>${paymentMethod === 'cod' ? 'Total (Collect at Delivery)' : 'Total Paid'}</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>${total} INR</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">© 2026 Cozee™. All rights reserved.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.warn("Email credentials not configured. Order details:", orderData);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ error: "Failed to send order confirmation email" });
    }
});

app.get("/api/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

export default app;
