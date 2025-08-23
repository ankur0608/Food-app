import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../hooks/useMeals";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: meals = [], isLoading } = useMeals(); // ✅ use hook
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Responsive width
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const getWidth = () => {
    if (!open) return 0;
    if (isXs) return "100%";
    if (isSm) return 250;
    if (isMdUp) return 290;
    return 290;
  };

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Close on click outside or Esc
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{ position: "relative", width: isXs ? "100%" : "auto" }}
    >
      {!open && (
        <IconButton onClick={() => setOpen(true)} sx={{ p: 0 }}>
          <SearchIcon />
        </IconButton>
      )}

      <Fade in={open}>
        <TextField
          inputRef={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meals..."
          size="small"
          variant="outlined"
          sx={{
            width: getWidth(),
            ml: open ? 1 : 0,
            mb: 1.5,
            transition: "width 0.3s",
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              height: 40,
              paddingRight: 0,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearchQuery("");
                    inputRef.current?.focus();
                  }}
                  edge="end"
                  size="small"
                >
                  <CloseIcon
                    fontSize="small"
                    style={{ marginRight: "0.5rem" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Fade>

      {open && searchQuery && (
        <Paper
          sx={{
            position: "absolute",
            top: 45,
            width: getWidth(),
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 1200,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : filteredMeals.length > 0 ? (
            <List>
              {filteredMeals.map((meal) => (
                <ListItem
                  key={meal.id}
                  button
                  onClick={() => navigate(`/meals/${meal.name}`)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={meal.image}
                      alt={meal.name}
                      sx={{ width: 40, height: 40, borderRadius: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={meal.name}
                    secondary={`₹${meal.price}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ px: 2, py: 1 }}>No meals found</Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
