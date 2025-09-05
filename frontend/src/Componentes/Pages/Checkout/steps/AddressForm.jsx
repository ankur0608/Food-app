import { Controller } from "react-hook-form";
import { Grid, TextField, InputAdornment } from "@mui/material";
import { FaRegAddressBook } from "react-icons/fa6";

const AddressForm = ({ control, errors }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Controller
        name="addressLine"
        control={control}
        rules={{ required: "Address Line is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address Line"
            aria-label="Address Line"
            error={!!errors.addressLine}
            helperText={errors.addressLine?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaRegAddressBook />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Grid>
    <Grid item xs={6}>
      <Controller
        name="city"
        control={control}
        rules={{ required: "City is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="City"
            aria-label="City"
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={6}>
      <Controller
        name="pincode"
        control={control}
        rules={{
          required: "Pincode is required",
          pattern: {
            value: /^[0-9]{5,6}$/,
            message: "Enter valid pincode",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Pincode"
            aria-label="Pincode"
            error={!!errors.pincode}
            helperText={errors.pincode?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={6}>
      <Controller
        name="state"
        control={control}
        rules={{ required: "State is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="State"
            aria-label="State"
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={6}>
      <Controller
        name="country"
        control={control}
        rules={{ required: "Country is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Country"
            aria-label="Country"
            error={!!errors.country}
            helperText={errors.country?.message}
          />
        )}
      />
    </Grid>
  </Grid>
);

export default AddressForm;
