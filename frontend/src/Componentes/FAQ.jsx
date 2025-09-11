"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PoolIcon from "@mui/icons-material/Pool";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const faqs = [
  {
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is from 2 PM and check-out is by 12 PM. Early check-in or late check-out may be available upon request.",
    icon: <AccessTimeIcon />,
    category: "Timing",
  },
  {
    question: "What facilities does the hotel provide?",
    answer:
      "We offer a swimming pool, restaurant, 24/7 reception, parking, free Wi-Fi, and gym facilities for our guests.",
    icon: <PoolIcon />,
    category: "Facilities",
  },
  {
    question: "Where is the hotel located?",
    answer:
      "Our hotel is located at XYZ Street, City, State, Country. Easily accessible by car and public transport.",
    icon: <LocationOnIcon />,
    category: "Location",
  },
  {
    question: "Are there any special offers available?",
    answer:
      "Enjoy a 20% discount on Deluxe Rooms this week and seasonal packages during holidays. Check our offers page for more.",
    icon: <LocalOfferIcon />,
    category: "Offers",
  },
  {
    question: "How can I make a reservation?",
    answer:
      "Reservations can be made directly through our website, by phone, or via email. Contact our reception for group bookings.",
    icon: <EventAvailableIcon />,
    category: "Reservation",
  },
];

export default function FaqPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container sx={{ py: 12 }}>
      <Typography
        variant={isSm ? "h4" : "h3"}
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Frequently Asked Questions
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="text.secondary"
        mb={6}
      >
        Find answers to the most common questions about our hotel, facilities,
        and services.
      </Typography>

      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.01)" },
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                expanded === index ? (
                  <RemoveIcon sx={{ color: theme.palette.primary.main }} />
                ) : (
                  <AddIcon sx={{ color: theme.palette.primary.main }} />
                )
              }
              sx={{
                bgcolor: theme.palette.grey[50],
                borderRadius: 3,
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                mr: 5,
              }}
            >
              {faq.icon}
              <Box>
                <Typography fontWeight="bold">{faq.question}</Typography>
                {/* <Chip
                  label={faq.category}
                  size="small"
                  color="primary"
                  sx={{ mt: 0.5 }}
                /> */}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 2 }}>
              <Typography color="text.secondary" lineHeight={1.7}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
