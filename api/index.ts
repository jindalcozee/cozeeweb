import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";

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

app.get("/api/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

export default app;
