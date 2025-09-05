import { Controller } from "react-hook-form";
import { Stack, TextField, InputAdornment } from "@mui/material";
import { FaPhone, FaRegUser } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";

const UserDetailsForm = ({ control, errors }) => (
  <Stack spacing={2}>
    <Controller
      name="name"
      control={control}
      rules={{ required: "Full Name is required" }}
      render={({ field }) => (
        <TextField
          {...field}
          label="Full Name"
          aria-label="Full Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaRegUser />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
    <Controller
      name="email"
      control={control}
      rules={{
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email address",
        },
      }}
      render={({ field }) => (
        <TextField
          {...field}
          label="Email"
          type="email"
          aria-label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IoMailOutline />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
    <Controller
      name="mobile"
      control={control}
      rules={{
        required: "Mobile Number is required",
        pattern: {
          value: /^[0-9]{10,15}$/,
          message: "Enter valid mobile number",
        },
      }}
      render={({ field }) => (
        <TextField
          {...field}
          label="Mobile Number"
          type="tel"
          aria-label="Mobile Number"
          error={!!errors.mobile}
          helperText={errors.mobile?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaPhone />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  </Stack>
);

export default UserDetailsForm;
