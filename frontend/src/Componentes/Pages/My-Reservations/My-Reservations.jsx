"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import { useToast } from "../../Store/ToastContext";
import ReservationsTable from "./ReservationsTable";
import CancelDialog from "./CancelDialog";
import RescheduleDialog from "./RescheduleDialog";

export default function MyReservations() {
  const { showToast } = useToast();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName =
    storedUser?.user_metadata?.full_name ||
    storedUser?.user_metadata?.name ||
    "";
  const userEmail = storedUser?.email || storedUser?.user_metadata?.email || "";

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://food-app-d8r3.onrender.com/contact?email=${userEmail}`
      );
      setReservations(res.data.reservations || []);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
      setError("Failed to load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userEmail) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    fetchReservations();
  }, [userEmail]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 20 }}>
        <CircularProgress />
        <Typography mt={2}>Loading reservations...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 15 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!reservations.length)
    return (
      <Box sx={{ mt: 15 }}>
        <Alert severity="info">You have no reservations.</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, mt: 8 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, mb: 3, textAlign: { xs: "center", md: "left" } }}
      >
        My Reservations
      </Typography>

      <ReservationsTable
        reservations={reservations}
        userName={userName}
        userEmail={userEmail}
        setSelectedReservation={setSelectedReservation}
        setOpenCancelDialog={setOpenCancelDialog}
        setOpenRescheduleDialog={setOpenRescheduleDialog}
        fetchReservations={fetchReservations}
        showToast={showToast}
      />

      <CancelDialog
        open={openCancelDialog}
        setOpen={setOpenCancelDialog}
        reservation={selectedReservation}
        userName={userName}
        userEmail={userEmail}
        fetchReservations={fetchReservations}
        showToast={showToast}
      />

      <RescheduleDialog
        open={openRescheduleDialog}
        setOpen={setOpenRescheduleDialog}
        reservation={selectedReservation}
        userName={userName}
        userEmail={userEmail}
        fetchReservations={fetchReservations}
        showToast={showToast}
      />
    </Box>
  );
}
