// CustomArrows.jsx
import { memo } from "react";
import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

export const NextArrow = memo(({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      right: -15,
      top: "40%",
      zIndex: 10,
      bgcolor: "background.paper",
      "&:hover": { bgcolor: "grey.300" },
    }}
  >
    <ArrowForwardIos fontSize="small" />
  </IconButton>
));

export const PrevArrow = memo(({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      left: -15,
      top: "40%",
      zIndex: 10,
      bgcolor: "background.paper",
      "&:hover": { bgcolor: "grey.300" },
    }}
  >
    <ArrowBackIos fontSize="small" />
  </IconButton>
));
