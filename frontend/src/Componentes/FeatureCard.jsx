import React, { useMemo } from "react";
import { Grid, Typography, Card, CardContent, Container } from "@mui/material";
import { FaLeaf, FaCarrot, FaAppleAlt, FaDrumstickBite } from "react-icons/fa";

// Memoized feature card
const FeatureCard = React.memo(({ icon, title, desc }) => (
  <Card
    elevation={3}
    sx={{
      borderRadius: 3,
      textAlign: "center",
      py: { xs: 2, sm: 3 },
      px: { xs: 1, sm: 2 },
      transition: "all 0.3s",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: 6,
      },
    }}
  >
    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
      {icon}
      <Typography
        variant="h6"
        fontWeight={600}
        mt={1}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" } }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" } }}
      >
        {desc}
      </Typography>
    </CardContent>
  </Card>
));

export default function FeaturesSection() {
  const features = useMemo(
    () => [
      {
        icon: <FaLeaf size={32} color="#0bbf54" />,
        title: "Premium Quality",
        desc: "Only the finest ingredients curated for freshness and taste.",
      },
      {
        icon: <FaCarrot size={32} color="#f7571e" />,
        title: "Seasonal Vegetables",
        desc: "Handpicked veggies sourced directly from local farmers.",
      },
      {
        icon: <FaAppleAlt size={32} color="#ff3131" />,
        title: "Fresh Fruit",
        desc: "Juicy, organic fruits to make every bite healthy and tasty.",
      },
      {
        icon: <FaDrumstickBite size={32} color="#7c5353" />,
        title: "Non-Vegetarian Delights",
        desc: "A wide range of fresh and delicious meat options for you.",
      },
    ],
    []
  );

  return (
    <Container>
      <Typography
        variant="h4"
        fontWeight={700}
        align="center"
        mt={{ xs: 5, md: 8 }}
        mb={{ xs: 3, md: 5 }}
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" } }}
      >
        Why Choose Us?
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 5 }} justifyContent="center">
        {features.map((item, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <FeatureCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
