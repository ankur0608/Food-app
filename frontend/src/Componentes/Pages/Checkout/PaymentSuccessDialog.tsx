import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const PaymentSuccessDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="payment-success-dialog"
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle
      id="payment-success-dialog"
      sx={{ fontWeight: 700, textAlign: "center", mt: 1, color: "primary" }}
    >
      🎉 Payment Successful
    </DialogTitle>
    <DialogContent sx={{ textAlign: "center", py: 2 }}>
      <Typography variant="body1" color="text.secondary">
        Thank you for your purchase! Your payment has been processed
        successfully.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
      <Button
        variant="contained"
        sx={{
          borderRadius: 3,
          px: 4,
          py: 1.2,
          textTransform: "none",
          background: "linear-gradient(90deg,#ff6600,#ff8533)",
        }}
        onClick={onClose}
      >
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default PaymentSuccessDialog;
