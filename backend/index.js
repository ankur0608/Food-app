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

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const { data: existingUsers, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);
    if (fetchError) throw fetchError;
    if (existingUsers.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: insertedData, error: insertError } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (insertError || !insertedData.length) throw insertError;

    const userId = insertedData[0].id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);
    if (error || !users.length)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
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

app.get("/payment-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const result = data.map((p) => ({
      date: new Date(p.created_at).toLocaleDateString(),
      orderId: p.order_id,
      amount: p.amount,
      status: p.status,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment history" });
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
      currency,
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
