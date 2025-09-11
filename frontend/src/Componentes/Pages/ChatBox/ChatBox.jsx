"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import namaste from "../../../assets/namaste.png";
import ChatIcon from "@mui/icons-material/Chat";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reservation, setReservation] = useState({});
  const [reservationStep, setReservationStep] = useState(null);
  const [menuStep, setMenuStep] = useState(null);
  const [hotelStep, setHotelStep] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const initialBotMessage = {
    id: "bot-1",
    user_id: "bot",
    message: "Hi! I’m Ira, your assistant. Please select an option:",
    isBot: true,
    options: ["Hotel Information", "View Menu", "Make a Reservation"],
    timestamp: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };

  useEffect(() => resetChat(), []);
  useEffect(() => scrollToBottom(), [messages]);

  const resetChat = () => {
    setMessages([initialBotMessage]);
    setReservation({});
    setReservationStep(null);
    setMenuStep(null);
    setHotelStep(null);
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const sendMessage = async (msg, isBot = false) => {
    if (!msg) return;

    const generateId = () =>
      `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const greetings = ["hi", "hello", "hey", "namaste"];

    // 1️⃣ If user sends a greeting
    if (!isBot && greetings.includes(msg.toLowerCase())) {
      const userMsg = {
        id: generateId(),
        user_id: user?.id,
        message: msg,
        isBot: false,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      const botMsg = {
        id: generateId(),
        user_id: "bot",
        message: "👋 Hi there! I’m Ira.",
        isBot: true,
        options: ["Hotel Information", "View Menu", "Make a Reservation"],
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setNewMsg("");
      return;
    }

    // 2️⃣ Normal user message
    const messageObj = {
      id: generateId(),
      user_id: isBot ? "bot" : user?.id,
      message: msg,
      isBot,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, messageObj]);
    if (!isBot) setNewMsg("");

    // 3️⃣ Default fallback if message not recognized
    if (
      !isBot &&
      !["View Menu", "Hotel Information", "Make a Reservation"].includes(msg)
    ) {
      const botFallback = {
        id: generateId(),
        user_id: "bot",
        message:
          "🙂 I’m not sure what you mean. Please select one of the options below:",
        isBot: true,
        options: ["Hotel Information", "View Menu", "Make a Reservation"],
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
      setTimeout(() => setMessages((prev) => [...prev, botFallback]), 500);
    }

    if (!isBot) {
      // ---- MENU FLOW ----
      if (msg === "View Menu") {
        setMenuStep("choice");
        setTimeout(
          () =>
            setMessages((prev) => [
              ...prev,
              {
                id: generateId(),
                user_id: "bot",
                message:
                  "Would you like to see the full menu or search a specific food?",
                isBot: true,
                options: ["Full Menu", "Specific Food"],
                timestamp: new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }),
              },
            ]),
          500
        );
      }
      // ---- FOOD SEARCH LOGIC ----
      else if (menuStep === "choice") {
        if (msg === "Full Menu") navigate("/meals");
        else if (msg === "Specific Food") {
          setMenuStep("search");
          sendMessage(
            "Please type the name of the food you want to search:",
            true
          );
        }
      } else if (menuStep === "search") {
        try {
          const { data, error } = await supabase
            .from("foods")
            .select("id, name, price, description, image")
            .ilike("name", `*${msg}*`);

          if (error || !data || data.length === 0) {
            sendMessage(
              "❌ Sorry, we couldn’t find that food. Try another name.",
              true
            );
          } else {
            const food = data[0];
            const imageSrc = food.image.startsWith("http")
              ? food.image
              : `https://food-app-d8r3.onrender.com/images/${food.image}`;

            setMessages((prev) => [
              ...prev,
              {
                id: generateId(),
                user_id: "bot",
                message: `${food.name} - ₹${food.price}\n${
                  food.description || ""
                }`,
                isBot: true,
                options: ["View Details"],
                image: imageSrc,
                timestamp: new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }),
              },
            ]);

            setMenuStep({ action: "viewFood", foodName: food.name });
          }
        } catch (err) {
          sendMessage("⚠️ Server error. Please try again later.", true);
        }
      } else if (menuStep?.action === "viewFood" && msg === "View Details") {
        navigate(`/meals/${encodeURIComponent(menuStep.foodName)}`);
        setMenuStep(null);
      }

      // ---- RESERVATION FLOW ----
      if (msg === "Make a Reservation") {
        setReservation({});
        setReservationStep("firstName");
        setTimeout(
          () => sendMessage("Great! What's your first name?", true),
          500
        );
      } else {
        handleReservation(msg);
      }

      // ---- HOTEL INFO FLOW ----
      if (msg === "Hotel Information") {
        handleHotelInfo(msg);
      }
    }
  };

  const handleReservation = async (msg) => {
    if (!reservationStep) return;

    if (reservationStep === "firstName") {
      setReservation({ ...reservation, firstName: msg });
      setReservationStep("lastName");
      sendMessage("And your last name?", true);
    } else if (reservationStep === "lastName") {
      setReservation({ ...reservation, lastName: msg });
      setReservationStep("email");
      sendMessage("Please enter your email:", true);
    } else if (reservationStep === "email") {
      if (!isValidEmail(msg)) return sendMessage("❌ Invalid email.", true);
      setReservation({ ...reservation, email: msg });
      setReservationStep("phone");
      sendMessage("Your phone number? (10 digits)", true);
    } else if (reservationStep === "phone") {
      if (!isValidPhone(msg)) return sendMessage("❌ Invalid phone.", true);
      setReservation({ ...reservation, phone: msg });
      setReservationStep("date");
      sendMessage("What date would you like to book? (YYYY-MM-DD)", true);
    } else if (reservationStep === "date") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(msg))
        return sendMessage("❌ Invalid date format. Use YYYY-MM-DD.", true);
      setReservation({ ...reservation, date: msg });
      setReservationStep("time");
      sendMessage("What time? (e.g., 7:00 PM)", true);
    } else if (reservationStep === "time") {
      setReservation({ ...reservation, time: msg });
      setReservationStep("guests");
      sendMessage("How many guests?", true);
    } else if (reservationStep === "guests") {
      const guests = Number(msg);
      if (isNaN(guests) || guests < 1)
        return sendMessage("❌ Enter valid number of guests.", true);

      const finalData = { ...reservation, guests };
      try {
        const res = await fetch("https://food-app-d8r3.onrender.com/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        });
        sendMessage(
          res.ok ? "Reservation submitted successfully!" : "❌ Failed to book.",
          true
        );
      } catch {
        sendMessage("❌ Server error. Try later.", true);
      }

      setReservation({});
      setReservationStep(null);
    }
  };

  const handleHotelInfo = (msg) => {
    // ---- HOTEL INFO FLOW ----
    if (msg === "Hotel Information") {
      if (!hotelStep) {
        setHotelStep("summary"); // step active
        setTimeout(
          () =>
            setMessages((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                user_id: "bot",
                message:
                  "Welcome to our hotel! We offer comfortable rooms, a swimming pool, a restaurant, 24/7 reception, and convenient city location.",
                isBot: true,
                options: [
                  { label: "View More", type: "navigate", path: "/faqpage" },
                ],
                timestamp: new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }),
              },
            ]),
          500
        );
      }
    } else if (hotelStep === "summary") {
      // Handle "View More" button click
      if (msg === "View More") {
        navigate("/faq"); // navigate to FAQ page
        setHotelStep(null);
        sendMessage(
          "You can read all frequently asked questions about our hotel here.",
          true
        );
      } else {
        sendMessage(
          "Please click the 'View More' button to learn more about our hotel.",
          true
        );
      }
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#ad8b3a",
            color: "#fff",
            padding: "14px",
            borderRadius: "50px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
          }}
        >
          <ChatIcon />
        </button>
      )}

      {isOpen && (
        <div
          className="chat-window"
          style={{
            width: "400px",
            height: "83vh",
            background: "#f9f9fb",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          <ChatHeader namaste={namaste} onClose={() => setIsOpen(false)} />

          <MessagesList
            messages={messages}
            messagesEndRef={messagesEndRef}
            sendMessage={sendMessage}
            navigate={navigate}
          />

          <ChatInput
            newMsg={newMsg}
            setNewMsg={setNewMsg}
            sendMessage={sendMessage}
            resetChat={resetChat}
          />
        </div>
      )}
    </div>
  );
}
