const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticateToken = require("./middleware/auth");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "https://food-app-d8r3.onrender.com",
      "https://food-app-five-mu.vercel.app",
      "https://food-app-git-main-ankur-patels-projects-15e166ca.vercel.app",
      "https://food-ddbg91ujb-ankur-patels-projects-15e166ca.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

// Health Check
// app.get("/home", (req, res) => {
//   res.send("✅ Food App Backend is running!");
// });

// Routes
app.get("/meals", async (req, res) => {
  try {
    const { data: meals, error } = await supabase.from("foods").select("*");
    if (error) throw error;
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meals from DB" });
  }
});

app.get("/meals/:name", async (req, res) => {
  try {
    const { data: meals, error } = await supabase.from("foods").select("*");
    if (error) throw error;

    const meal = meals.find(
      (meal) => meal.name.toLowerCase() === req.params.name.toLowerCase()
    );

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
});

app.post("/save-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    name,
    email,
    mobile,
    address,
    items = [],
  } = req.body;

  try {
    const { data, error } = await supabase.from("orders").insert([
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        amount,
        currency,
        name,
        email,
        mobile,
        address,
        items,
      },
    ]);
    if (error) throw error;
    res.status(201).json({ message: "Payment saved successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Failed to save payment" });
  }
});

app.post("/save-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    name,
    email,
    mobile,
    address,
    items,
    user_id, // Make sure frontend sends user_id
  } = req.body;

  console.log("💳 Payment request received:");
  console.log({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    name,
    email,
    mobile,
    address,
    items,
    user_id,
  });

  // Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error("❌ Cart items missing or invalid");
    return res.status(400).json({ error: "Cart items are required" });
  }

  if (!user_id) {
    console.error("❌ user_id missing");
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const { data, error } = await supabase.from("orders").insert([
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        amount,
        currency,
        name,
        email,
        mobile,
        address,
        items,
        user_id,
      },
    ]);

    if (error) throw error;

    console.log("✅ Payment saved successfully:", data);
    res.status(201).json({ message: "Payment saved successfully", data });
  } catch (err) {
    console.error("❌ Failed to save payment:", err.message);
    res.status(500).json({ error: "Failed to save payment" });
  }
});

app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency are required" });
  }
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, phone, date, time, guests } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !date ||
    !time ||
    !guests
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const { data, error } = await supabase.from("contacts").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date,
        time,
        guests: Number(guests),
      },
    ]);
    if (error) throw error;
    res
      .status(201)
      .json({ message: "Reservation submitted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/assign-new-user", async (req, res) => {
  const { user_id, name, email } = req.body;
  console.log("🔹 assign-new-user called:", { user_id, name, email });

  if (!user_id || !email) {
    console.log("❌ Missing user_id or email");
    return res.status(400).json({ error: "user_id and email required" });
  }

  // Check if user already has coupon
  const { data: existing, error: existingError } = await supabase
    .from("user_coupons")
    .select("coupon_id")
    .eq("user_id", user_id)
    .maybeSingle();
  if (existingError)
    console.error("❌ Error checking existing coupon:", existingError);

  if (existing) {
    console.log("ℹ️ Coupon already assigned");
    return res.status(200).json({ message: "Coupon already assigned" });
  }

  // Generate random coupon code (example: WEL-AB12CD34)
  const randomCode =
    "WEL-" + crypto.randomBytes(4).toString("hex").toUpperCase();

  // Create coupon in DB
  const { data: coupon, error: createError } = await supabase
    .from("coupons")
    .insert({
      code: randomCode,
      discount_percent: 10,
      max_uses: 1,
      used_count: 0,
      expires_at: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days expiry
      active: true,
    })
    .select()
    .single();

  if (createError) {
    console.error("❌ Failed to create coupon:", createError);
    return res.status(500).json({ error: "Failed to create coupon" });
  }
  console.log("✅ Created new coupon:", coupon);

  // Assign coupon to user
  const { data: insertData, error: insertError } = await supabase
    .from("user_coupons")
    .insert({ user_id, coupon_id: coupon.id });
  if (insertError) {
    console.error("❌ Error inserting user_coupon:", insertError);
    return res.status(500).json({ error: "Failed to assign coupon" });
  }
  console.log("✅ Coupon assigned to user:", insertData);

  // Send email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const info = await transporter.sendMail({
      from: '"Hotel App" <no-reply@hotel.com>',
      to: email,
      subject: "Welcome Coupon 🎉",
      html: `<p>Hi ${name},</p>
             <p>Here is your welcome coupon: <b>${coupon.code}</b> for ${
        coupon.discount_percent
      }% off your first booking!</p>
             <p>Valid until: ${new Date(
               coupon.expires_at
             ).toLocaleDateString()}</p>`,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }

  res
    .status(201)
    .json({ message: "Coupon assigned and email sent", code: coupon.code });
});

app.post("/validate", async (req, res) => {
  const { user_id, code } = req.body;
  console.log("🔹 validate called:", { user_id, code });

  if (!user_id || !code) {
    console.log("❌ Missing user_id or code");
    return res.status(400).json({ error: "user_id and code required" });
  }

  // validate route
  const { data: userCoupon, error: userCouponError } = await supabase
    .from("user_coupons")
    .select("coupons(*)") // <-- change here to match FK
    .eq("user_id", user_id)
    .maybeSingle();

  if (userCouponError) {
    console.error("❌ Error fetching user coupon:", userCouponError);
    return res.status(500).json({ error: "Failed to fetch coupon" });
  }

  if (!userCoupon || userCoupon.coupons.code !== code) {
    console.log("❌ Invalid coupon");
    return res.status(400).json({ valid: false, message: "Invalid coupon" });
  }

  const coupon = userCoupon.coupons;
  if (!coupon.active) {
    console.log("❌ Coupon inactive");
    return res.status(400).json({ valid: false, message: "Coupon inactive" });
  }
  if (coupon.used_count >= coupon.max_uses) {
    console.log("❌ Coupon limit reached");
    return res
      .status(400)
      .json({ valid: false, message: "Coupon limit reached" });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    console.log("❌ Coupon expired");
    return res.status(400).json({ valid: false, message: "Coupon expired" });
  }

  console.log("✅ Coupon valid:", coupon);
  res.json({ valid: true, discount: coupon.discount_percent });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
