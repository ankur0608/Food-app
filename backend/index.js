const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
require("dotenv").config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Razorpay POST /order endpoint

// 🧾 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

// 🚀 Create order endpoint
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay accepts paisa (INR x 100)
      currency: "USD",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Razorpay error:", err);
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
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide username, email, and password" });
  }

  try {
    let users = [];
    try {
      users = await readJsonFile("users.json");
    } catch {
      // If users.json does not exist, start with empty array
      users = [];
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = {
      id: uuidv4(),
      username,
      email,
      password, // Plain text (not secure, but ok for demo)
    };
    users.push(newUser);

    await writeJsonFile("users.json", users);

    // Create a dummy token (in real apps use JWT)
    const token = uuidv4();

    // You could store tokens for validation or just send for demo
    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const users = await readJsonFile("users.json");

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Dummy token for demo purposes
    const token = uuidv4();

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/contact", (req, res) => {
  const { firstName, lastName, email, mobile } = req.body;

  if (!firstName || !lastName || !email || !mobile) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newContact = {
    firstName,
    lastName,
    email,
    mobile,
    submittedAt: new Date().toISOString(),
  };
  const contactsFile = path.join(__dirname, "data", "contacts.json");

  fs.readFile(contactsFile, "utf8", (readErr, data) => {
    let contacts = [];

    if (!readErr) {
      try {
        contacts = JSON.parse(data);
        if (!Array.isArray(contacts)) contacts = [];
      } catch {
        contacts = [];
      }
    }

    contacts.push(newContact);

    fs.writeFile(
      contactsFile,
      JSON.stringify(contacts, null, 2),
      (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: "Failed to save contact data" });
        }

        return res.json({ message: "Contact form submitted successfully" });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
