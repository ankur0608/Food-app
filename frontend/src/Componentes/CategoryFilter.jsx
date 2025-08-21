import { Button, Box } from "@mui/material";

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: { xs: 1, sm: 1.5, md: 2 },
        mb: 4,
        mt: 2,
      }}
    >
      {categories.map((cat) => (
        <Button
          key={cat}
          onClick={() => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          sx={{
            textTransform: "capitalize",
            borderRadius: "20px",
            px: { xs: 1.5, sm: 2.5, md: 3 },
            py: { xs: 0.4, sm: 0.7, md: 1 },
            fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
            fontWeight: 600,
            minWidth: "auto",
            color: selectedCategory === cat ? "#fff" : "primary.main",
            backgroundColor:
              selectedCategory === cat ? "primary.main" : "transparent",
            border: "1.5px solid",
            borderColor:
              selectedCategory === cat ? "primary.main" : "rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor:
                selectedCategory === cat ? "primary.dark" : "rgba(0,0,0,0.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {cat}
        </Button>
      ))}
    </Box>
  );
}
