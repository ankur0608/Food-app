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

app.post("/contact/reschedule", async (req, res) => {
  const { reservationId, newDate, newTime } = req.body;

  if (!reservationId || !newDate || !newTime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data, error } = await supabase
      .from("contacts")
      .update({ date: newDate, time: newTime, status: "rescheduled" })
      .eq("id", reservationId);

    if (error) throw error;

    res
      .status(200)
      .json({ message: "Reservation rescheduled successfully", data });
  } catch (err) {
    console.error("Error rescheduling reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// DELETE /contact/:id → delete a reservation by ID
app.delete("/contact/:id", async (req, res) => {
  const reservationId = req.params.id;

  if (!reservationId)
    return res.status(400).json({ error: "Reservation ID is required" });

  try {
    const { data, error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", reservationId);

    if (error) throw error;

    res.status(200).json({ message: "Reservation deleted successfully", data });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// GET /contact → fetch all reservations for a specific user
app.get("/contact", async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ reservations: data });
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// PUT /contact/:id → update any field of a reservation
app.put("/contact/:id", async (req, res) => {
  const reservationId = req.params.id;
  const updates = req.body; // {date, time, status, guests, etc.}

  if (!reservationId || !updates)
    return res
      .status(400)
      .json({ error: "Reservation ID and updates required" });

  try {
    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", reservationId);

    if (error) throw error;

    res.status(200).json({ message: "Reservation updated successfully", data });
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function sendCouponEmail(name, email, coupon) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const info = await transporter.sendMail({
      from: '"Hotel App" <no-reply@hotel.com>',
      to: email,
      subject: "🎉 Welcome! Your Exclusive Coupon Awaits",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2E86DE;">Hi ${name},</h2>
          <p>Welcome to <strong>Hotel App</strong>! We are excited to have you on board.</p>
          <p>Here’s your <strong>exclusive coupon</strong>:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #27AE60;">${coupon.code}</h3>
            <p style="margin: 5px 0 0; font-weight: bold;">${
              coupon.discount_percent
            }% off your first booking</p>
          </div>
          <p>This coupon is valid until <strong>${new Date(
            coupon.expires_at
          ).toLocaleDateString()}</strong>.</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
}

async function validateCoupon(user_id, code) {
  const { data: userCoupons } = await supabase
    .from("user_coupons")
    .select("*, coupons(*)")
    .eq("user_id", user_id);

  if (!userCoupons) return { valid: false, message: "Invalid coupon" };

  const userCoupon = userCoupons.find((c) => c.coupons.code === code);
  if (!userCoupon) return { valid: false, message: "Invalid coupon" };

  const c = userCoupon.coupons;

  if (!c.active) return { valid: false, message: "Coupon inactive" };
  if (userCoupon.used) return { valid: false, message: "Coupon already used" };
  if (c.used_count >= c.max_uses)
    return { valid: false, message: "Coupon limit reached" };
  if (c.expires_at && new Date(c.expires_at) < new Date())
    return { valid: false, message: "Coupon expired" };

  return { valid: true, coupon: c, userCoupon };
}
// Assign new user a coupon
app.post("/assign-new-user", async (req, res) => {
  const { user_id, name, email } = req.body;
  console.log("📌 /assign-new-user called with:", req.body);

  if (!user_id || !email) {
    console.warn("⚠️ Missing user_id or email");
    return res.status(400).json({ error: "user_id and email required" });
  }

  try {
    // Check if user already has a coupon
    const { data: existingCoupons, error: existingError } = await supabase
      .from("user_coupons")
      .select("*")
      .eq("user_id", user_id);

    if (existingError)
      console.error("❌ Error fetching existing coupons:", existingError);

    console.log("📝 Existing coupons:", existingCoupons);

    if (existingCoupons?.length > 0) {
      console.log("ℹ️ Coupon already assigned to user");
      return res.status(200).json({ message: "Coupon already assigned" });
    }

    // Create coupon
    const randomCode =
      "WEL-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const { data: coupon, error: couponError } = await supabase
      .from("coupons")
      .insert({
        code: randomCode,
        discount_percent: 10,
        max_uses: 1,
        used_count: 0,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        active: true,
      })
      .select()
      .single();

    if (couponError) console.error("❌ Error creating coupon:", couponError);
    console.log("🎫 New coupon created:", coupon);

    // Assign coupon
    const { data: assigned, error: assignError } = await supabase
      .from("user_coupons")
      .insert({ user_id, coupon_id: coupon.id })
      .select()
      .single();

    if (assignError) console.error("❌ Error assigning coupon:", assignError);
    console.log("✅ Coupon assigned to user:", assigned);

    // Send email
    await sendCouponEmail(name, email, coupon);
    console.log("✉️ Coupon email sent to:", email);

    res
      .status(201)
      .json({ message: "Coupon assigned and email sent", code: coupon.code });
  } catch (err) {
    console.error("❌ assign-new-user failed:", err);
    res.status(500).json({ error: "Failed to assign coupon" });
  }
});

// Validate coupon
app.post("/validate", async (req, res) => {
  const { user_id, code } = req.body;
  console.log("📌 /validate called with:", req.body);

  if (!user_id || !code) {
    console.warn("⚠️ Missing user_id or code");
    return res.status(400).json({ error: "user_id and code required" });
  }

  try {
    const result = await validateCoupon(user_id, code);
    console.log("📝 Coupon validation result:", result);

    if (!result.valid) {
      console.log("❌ Invalid coupon:", result.message);
      return res.status(400).json({ valid: false, message: result.message });
    }

    res.json({
      valid: true,
      coupon_id: result.coupon.id,
      discount: result.coupon.discount_percent,
    });
  } catch (err) {
    console.error("❌ validate failed:", err);
    res.status(500).json({ error: "Failed to validate coupon" });
  }
});

// Save payment & mark coupon as used
app.post("/save-payment", async (req, res) => {
  console.log("📌 /save-payment called with:", req.body);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency = "INR",
    name,
    email,
    mobile,
    address,
    user_id,
    coupon_code,
    items,
  } = req.body;

  try {
    let coupon = null;

    if (coupon_code) {
      const result = await validateCoupon(user_id, coupon_code);
      console.log("📝 Coupon check for payment:", result);

      if (!result.valid) {
        console.log("❌ Coupon invalid during payment save");
        return res.status(400).json({ error: result.message });
      }

      coupon = result.coupon;
    }

    // 📝 Save order with mobile + address too
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          amount,
          currency,
          name,
          email,
          mobile: mobile || "", // fallback to empty string
          address: address || "",
          user_id,
          items,
          coupon_code: coupon?.code || null,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("❌ Error saving order:", orderError);
      return res.status(500).json({ error: "Failed to save order" });
    }
    console.log("✅ Order saved:", order);

    // 🔄 Handle coupon if provided
    if (coupon) {
      const { data: updatedCoupon, error: couponUpdateError } = await supabase
        .from("coupons")
        .update({ used_count: coupon.used_count + 1 })
        .eq("id", coupon.id)
        .select()
        .single();

      if (couponUpdateError)
        console.error("❌ Error updating coupon usage:", couponUpdateError);
      else console.log("🔄 Coupon usage incremented:", updatedCoupon);

      const { data: userCouponUpdated, error: userCouponError } = await supabase
        .from("user_coupons")
        .update({ used: true, used_at: new Date() })
        .eq("user_id", user_id)
        .eq("coupon_id", coupon.id)
        .select()
        .single();

      if (userCouponError)
        console.error("❌ Error marking user coupon as used:", userCouponError);
      else console.log("✅ User coupon marked as used:", userCouponUpdated);
    }

    res.status(201).json({ message: "Payment saved successfully", order });
  } catch (err) {
    console.error("❌ save-payment failed:", err);
    res.status(500).json({ error: "Failed to save payment" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
