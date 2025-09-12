import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function CancelDialog({
  open,
  setOpen,
  reservation,
  userName,
  userEmail,
  fetchReservations,
  showToast,
}) {
  const [cancelReason, setCancelReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false); // confirmation popup

  const handleDelete = async () => {
    try {
      await axios.put(
        `https://food-app-d8r3.onrender.com/contact/cancel/${reservation.id}`,
        {
          reason: cancelReason,
          name: userName,
          email: userEmail,
        }
      );

      setConfirmOpen(false);
      setOpen(false);
      fetchReservations();
      showToast("Reservation cancelled successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel reservation. Please try again.", "error");
    }
  };

  return (
    <>
      {/* Main Cancel Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cancel Reservation</DialogTitle>
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
            label="Reason for Cancellation (optional)"
            fullWidth
            margin="dense"
            multiline
            minRows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmOpen(true)}
          >
            Cancel Reservation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this reservation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>No</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
