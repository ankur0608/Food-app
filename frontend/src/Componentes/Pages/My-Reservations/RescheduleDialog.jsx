import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

export default function RescheduleDialog({
  open,
  setOpen,
  reservation,
  userName,
  userEmail,
  fetchReservations,
  showToast,
}) {
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  useEffect(() => {
    if (reservation) {
      setRescheduleDate(reservation.date);
      setRescheduleTime(reservation.time);
    }
  }, [reservation]);

  const handleSubmit = async () => {
    const today = new Date();
    const selectedDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
    if (selectedDateTime < today) {
      showToast("You cannot select a past date/time.", "error");
      return;
    }

    try {
      await axios.post(
        `https://food-app-d8r3.onrender.com/contact/reschedule`,
        {
          reservationId: reservation.id,
          name: userName,
          email: userEmail,
          newDate: rescheduleDate,
          newTime: rescheduleTime,
        }
      );
      setOpen(false);
      fetchReservations();
      showToast("Reservation rescheduled successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to reschedule. Please try again.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Manage Reservation</DialogTitle>
      <DialogContent>
        <TextField
          label="Your Name"
          fullWidth
          margin="dense"
          value={userName}
          disabled
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={userEmail}
          disabled
        />
        <TextField
          label="New Date"
          type="date"
          fullWidth
          margin="dense"
          value={rescheduleDate}
          onChange={(e) => setRescheduleDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split("T")[0] }}
        />
        <TextField
          label="New Time"
          type="time"
          fullWidth
          margin="dense"
          value={rescheduleTime}
          onChange={(e) => setRescheduleTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Reschedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}
