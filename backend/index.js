const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/home", (req, res) => {
  res.send("✅ Food App Backend is running!");
});

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://food-app-five-mu.vercel.app",
      "https://food-app-d8r3.onrender.com",
      "https://food-app-git-main-ankur-patels-projects-15e166ca.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Must come before routes to parse JSON body
app.use(express.json());
// Razorpay POST /order endpoint

// 🧾 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});
// ✅ Save payment after successful Razorpay payment
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

    if (error) {
      console.error("❌ Supabase insert error:", error); // 👈 Log error clearly
      throw error;
    }

    // console.log("✅ Payment saved in Supabase:", data);
    res.status(201).json({ message: "Payment saved successfully", data });
  } catch (err) {
    console.error("❌ Error saving payment:", err); // 👈 This was showing "{}"
    res.status(500).json({ error: "Failed to save payment" });
  }
});

// 🚀 Create order endpoint
// ✅ Razorpay Order Creation Endpoint
app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency are required" });
  }

  try {
    const options = {
      amount: amount, // Amount in smallest unit (e.g., paise)
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // console.log("✅ Razorpay order created:", order);
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Serve static images from /images folder
app.use("/images", express.static(path.join(__dirname, "images")));

// Helper to read JSON file
const readJsonFile = (filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "data", filename);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

// Helper to write JSON file
const writeJsonFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "data", filename);
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Route: GET /meals → meals.json
app.get("/meals", async (req, res) => {
  try {
    const meals = await readJsonFile("meals.json");
    res.json(meals);
  } catch (err) {
    console.error("Failed to read meals.json:", err);
    res.status(500).json({ message: "Failed to read meals.json" });
  }
});

// Route: GET /available-meals → available-meals.json
app.get("/available-meals", async (req, res) => {
  try {
    const meals = await readJsonFile("available-meals.json");
    res.json(meals);
  } catch (err) {
    console.error("Failed to read available-meals.json:", err);
    res.status(500).json({ message: "Failed to read available-meals.json" });
  }
});

// POST /signup
app.post("/signup", async (req, res) => {
  // console.log("🔔 Signup request body:", req.body);
  const { username, email, password, mobile } = req.body;

  // Validate input
  if (!username || !email || !password || !mobile) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Check if email already exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError);
      throw fetchError;
    }

    if (existingUsers.length > 0) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user
    const { data: insertedData, error: insertError } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword, mobile }])

      .select(); // 👈 Required to get the inserted row

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError);
      throw insertError;
    }

    console.log("✅ User inserted:", insertedData);

    if (!insertedData || insertedData.length === 0) {
      console.error("❌ No data returned after insert");
      return res.status(500).json({ error: "Insert returned no data" });
    }

    const userId = insertedData[0].id;

    // 4. Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("🔑 JWT created for user:", userId);

    return res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("🔥 Signup error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  // console.log("🔐 Login request:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError);
      throw fetchError;
    }

    if (!users || users.length === 0) {
      console.warn("⚠️ No user found with email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn("❌ Password does not match for user:", user.email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("✅ Login successful:", user.email);

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/contact", async (req, res) => {
  console.log("🔥🔥🔥 POST /contact hit");
  console.log("📨 Received contact data:", req.body);

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
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        guests: Number(guests),
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save contact" });
    }

    console.log("✅ Contact saved to Supabase:", data);
    return res
      .status(201)
      .json({ message: "Reservation submitted successfully", data });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
