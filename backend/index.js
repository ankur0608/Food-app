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
// GET /meals?limit=8&page=1&category=Plush
app.get("/meals", async (req, res) => {
  try {
    let { limit, page, category } = req.query;
    limit = parseInt(limit) || 8;
    page = parseInt(page) || 1;

    let query = supabase.from("foods").select("*", { count: "exact" });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;
    console.log("Pagination debug:", { limit, page, start, end });

    query = query.range(start, end);

    const { data: meals, error, count } = await query;
    if (error) throw error;

    res.json({
      items: meals,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
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

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
