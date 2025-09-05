import {
  Paper,
  Typography,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

const PaymentReview = ({ items, total }) => (
  <Stack spacing={3}>
    <Typography variant="h6" fontWeight={600} aria-label="Review your cart">
      Review Your Cart
    </Typography>

    {items.length > 0 ? (
      <Paper variant="outlined">
        <Table sx={{ minWidth: 400 }} aria-label="Cart items table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 1,
                        objectFit: "cover",
                      }}
                    />
                    <Typography>{item.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="right" fontWeight={700}>
                Total
              </TableCell>
              <TableCell align="right" fontWeight={700}>
                ₹{parseFloat(total).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    ) : (
      <Typography color="text.secondary" aria-label="Empty cart message">
        Your cart is empty
      </Typography>
    )}

    <Typography variant="body1" textAlign="center" mt={2}>
      Click below to complete your payment securely.
    </Typography>
  </Stack>
);

export default PaymentReview;
