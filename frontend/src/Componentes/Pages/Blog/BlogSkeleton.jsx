import { Container, Skeleton } from "@mui/material";

export default function BlogSkeleton() {
  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Skeleton variant="text" width="60%" height={50} />
      <Skeleton
        variant="rectangular"
        height={300}
        sx={{ my: 2, borderRadius: 2 }}
      />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
    </Container>
  );
}
