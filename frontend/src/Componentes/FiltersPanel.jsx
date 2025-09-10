"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Typography,
  Checkbox,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

export default function FiltersPopup({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  rating,
  setRating,
  vegOnly,
  setVegOnly,
  setCurrentPage,
}) {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Categories");
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localPrice, setLocalPrice] = useState(priceRange);
  const [localRating, setLocalRating] = useState(rating);
  const [localVeg, setLocalVeg] = useState(vegOnly);

  const priceMap = {
    "Less than ₹300": [0, 300],
    "₹300 - ₹600": [300, 600],
    "Above ₹600": [600, 2000],
  };

  const filterOptions = {
    Categories: categories,
    Ratings: ["4.0+", "3.0+", "2.0+"],
    Cost: ["Less than ₹300", "₹300 - ₹600", "Above ₹600"],
    "Pure Veg": ["Veg Only"],
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleApply = () => {
    setSelectedCategory(localCategory);
    setPriceRange(localPrice);
    setRating(localRating);
    setVegOnly(localVeg);
    setCurrentPage(1);
    handleClose();
  };

  const handleReset = () => {
    setLocalCategory("All");
    setLocalPrice([0, 2000]);
    setLocalRating(0);
    setLocalVeg(false);
  };

  return (
    <Box>
      {/* Top Quick Filters */}
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={1}
        justifyContent="center"
        mb={2}
        sx={{ gap: 1 }}
      >
        {/* Main Filters Button */}
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleOpen}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Filters
        </Button>

        {/* Ratings Quick Filter */}
        <Button
          variant={rating === 4 ? "contained" : "outlined"}
          size="small"
          onClick={() => setRating(rating === 4 ? 0 : 4)} // toggle
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          4.0+
        </Button>

        {/* Veg Quick Filter */}
        <Button
          variant={vegOnly ? "contained" : "outlined"}
          size="small"
          onClick={() => setVegOnly(!vegOnly)} // toggle
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Pure Veg
        </Button>

        {/* Price Quick Filters */}
        {Object.keys(priceMap).map((label) => (
          <Button
            key={label}
            variant={
              priceRange[0] === priceMap[label][0] &&
              priceRange[1] === priceMap[label][1]
                ? "contained"
                : "outlined"
            }
            size="small"
            onClick={() =>
              priceRange[0] === priceMap[label][0] &&
              priceRange[1] === priceMap[label][1]
                ? setPriceRange([0, 2000]) // unset if clicked again
                : setPriceRange(priceMap[label])
            }
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {label}
          </Button>
        ))}
      </Stack>

      {/* Filter Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{ px: 0 }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2, // padding left & right
            py: 1.5, // padding top & bottom
            bgcolor: "background.paper", // matches dialog background
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" component="span" fontWeight={600}>
            Filters
          </Typography>

          <Button
            onClick={handleClose}
            sx={{
              minWidth: 0,
              p: 1,
              borderRadius: "50%",
              color: "text.primary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ClearIcon fontSize="small" />
          </Button>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2, pb: 1, px: { xs: 2, sm: 3 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            {/* Left Filter List */}
            <List
              sx={{
                width: { xs: "100%", sm: 140 },
                borderRight: { xs: "none", sm: "1px solid #ddd" },
              }}
            >
              {Object.keys(filterOptions).map((filter) => (
                <ListItemButton
                  key={filter}
                  selected={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  sx={{
                    position: "relative",
                    pl: 2,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      borderLeft: "4px solid #1976d2", // active blue line
                    },
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemText primary={filter} />
                </ListItemButton>
              ))}
            </List>

            {/* Right Filter Options */}
            <Box sx={{ flex: 1, pl: { xs: 0, sm: 2 }, pt: { xs: 2, sm: 0 } }}>
              {activeFilter === "Pure Veg" ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localVeg}
                      onChange={(e) => setLocalVeg(e.target.checked)}
                    />
                  }
                  label="Veg Only"
                />
              ) : (
                <RadioGroup
                  value={
                    activeFilter === "Ratings"
                      ? localRating.toString()
                      : activeFilter === "Cost"
                      ? JSON.stringify(localPrice)
                      : activeFilter === "Categories"
                      ? localCategory
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    switch (activeFilter) {
                      case "Ratings":
                        setLocalRating(parseFloat(val));
                        break;
                      case "Cost":
                        setLocalPrice(JSON.parse(val));
                        break;
                      case "Categories":
                        setLocalCategory(val);
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  {filterOptions[activeFilter].map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={
                        activeFilter === "Cost"
                          ? JSON.stringify(priceMap[opt])
                          : opt
                      }
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleReset}
            sx={{ textTransform: "none", color: "blue", fontWeight: "bold" }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
