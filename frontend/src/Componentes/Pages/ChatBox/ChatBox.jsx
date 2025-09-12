"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import namaste from "../../../assets/namaste.png";
import ChatIcon from "@mui/icons-material/Chat";

export default function ChatBox() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reservation, setReservation] = useState({});
  const [reservationStep, setReservationStep] = useState(null);
  const [menuStep, setMenuStep] = useState(null);
  const [hotelStep, setHotelStep] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();
      if (error) return console.log("Supabase auth error:", error);
      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || "Guest",
          email: currentUser.email,
        });
      }
    };
    fetchUser();
  }, []);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const resetChat = () => {
    const initialBotMessage = {
      id: "bot-1",
      user_id: "bot",
      message: user
        ? `Hi ${user.name}! Please select an option:`
        : "Hi! Please login or sign up to get all features.",
      isBot: true,
      options: user
        ? ["Hotel Information", "View Menu", "Make a Reservation"]
        : [
            { label: "Login / Sign Up", type: "navigate", path: "/login" },
            "Hotel Information",
            "View Menu",
          ],
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };
    setMessages([initialBotMessage]);
    setReservation({});
    setReservationStep(null);
    setMenuStep(null);
    setHotelStep(null);
  };

  useEffect(() => resetChat(), [user]);
  useEffect(() => scrollToBottom(), [messages]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const sendMessage = async (msg, isBot = false) => {
    if (!msg) return;

    const generateId = () =>
      `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const userMsg = {
      id: generateId(),
      user_id: isBot ? "bot" : user?.id || "guest",
      message: msg,
      isBot,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!isBot) setNewMsg("");

    if (!isBot) handleFlows(msg);
  };

  const handleFlows = async (msg) => {
    const generateId = () =>
      `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Handle button navigation
    if (typeof msg === "object" && msg.type === "navigate") {
      navigate(msg.path);
      return;
    }

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
      return;
    } else if (menuStep === "choice") {
      if (msg === "Full Menu") return navigate("/meals");
      else if (msg === "Specific Food") {
        setMenuStep("search");
        return sendMessage(
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
          return sendMessage(
            "❌ Sorry, we couldn’t find that food. Try another name.",
            true
          );
        }

        const food = data[0];
        const imageSrc = food.image.startsWith("http")
          ? food.image
          : `https://food-app-d8r3.onrender.com/images/${food.image}`;

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            user_id: "bot",
            message: `${food.name} - ₹${food.price}\n${food.description || ""}`,
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
      } catch {
        sendMessage("⚠️ Server error. Please try again later.", true);
      }
      return;
    } else if (menuStep?.action === "viewFood" && msg === "View Details") {
      navigate(`/meals/${encodeURIComponent(menuStep.foodName)}`);
      setMenuStep(null);
      return;
    }

    // ---- RESERVATION FLOW ----
    if (msg === "Make a Reservation") {
      if (!user) {
        sendMessage("❌ You need to login or sign up first.", true);
        return;
      } else {
        setReservation({
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ")[1] || "",
          email: user.email,
        });
        setReservationStep("phone");
        sendMessage("Great! Can I have your phone number? (10 digits)", true);
      }
      return;
    }

    if (reservationStep) handleReservation(msg);

    // ---- HOTEL INFO FLOW ----
    if (msg === "Hotel Information") handleHotelInfo(msg);
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
        navigate("/reservations");
      } catch {
        sendMessage("❌ Server error. Try later.", true);
      }

      setReservation({});
      setReservationStep(null);
    }
  };

  const handleHotelInfo = (msg) => {
    const generateId = () =>
      `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    if (msg === "Hotel Information" && !hotelStep) {
      setHotelStep("summary");
      setTimeout(
        () =>
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
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
    } else if (hotelStep === "summary") {
      if (msg === "View More") {
        navigate("/faq");
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
