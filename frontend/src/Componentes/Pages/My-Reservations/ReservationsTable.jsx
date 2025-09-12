import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ReservationsTable({
  reservations,
  setSelectedReservation,
  setOpenCancelDialog,
  setOpenRescheduleDialog,
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuReservation, setMenuReservation] = useState(null);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase().trim();
    switch (s) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const handleMenuClick = (event, reservation) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuReservation(reservation);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuReservation(null);
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setOpenCancelDialog(true);
    handleMenuClose();
  };

  const handleRescheduleClick = (reservation) => {
    setSelectedReservation(reservation);
    setOpenRescheduleDialog(true);
    handleMenuClose();
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          height: "auto",
          overflowX: "auto",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Table sx={{ minWidth: 320 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, px: 1, textAlign: "center" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, px: 1, textAlign: "center" }}>
                Time
              </TableCell>
              <TableCell sx={{ fontWeight: 600, px: 1, textAlign: "center" }}>
                Guests
              </TableCell>
              <TableCell sx={{ fontWeight: 600, px: 1, textAlign: "center" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, px: 1, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((res, index) => (
              <TableRow
                key={res.id}
                hover
                sx={{
                  backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                  transition: "background-color 0.3s",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <TableCell sx={{ textAlign: "center", px: 1 }}>
                  {new Date(res.date).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ textAlign: "center", px: 1 }}>
                  {res.time}
                </TableCell>
                <TableCell sx={{ textAlign: "center", px: 1 }}>
                  {res.guests}
                </TableCell>
                <TableCell sx={{ textAlign: "center", px: 1 }}>
                  <Chip
                    label={
                      res.status.charAt(0).toUpperCase() + res.status.slice(1)
                    }
                    color={getStatusColor(res.status)}
                    variant="filled"
                    sx={{ fontWeight: 600, px: 1 }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", px: 0 }}>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, res)}
                    size="small"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {menuReservation?.status.toLowerCase() === "pending" && (
          <MenuItem onClick={() => handleCancelClick(menuReservation)}>
            Cancel
          </MenuItem>
        )}
        {menuReservation?.status.toLowerCase() === "approved" && (
          <>
            <MenuItem onClick={() => handleCancelClick(menuReservation)}>
              Cancel
            </MenuItem>
            <MenuItem onClick={() => handleRescheduleClick(menuReservation)}>
              Reschedule
            </MenuItem>
          </>
        )}
        {menuReservation?.status.toLowerCase() === "rejected" && (
          <MenuItem disabled>Rejected</MenuItem>
        )}
      </Menu>
    </>
  );
}
