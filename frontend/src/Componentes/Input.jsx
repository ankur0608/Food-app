import { forwardRef } from "react";
const Input = forwardRef(
  ({ label, type = "text", placeholder, ...rest }, ref) => {
    return (
      <div>
        <label style={{ color: "black", fontSize: "16px", fontWeight: "bold" }}>
          {label}
        </label>
        <input ref={ref} type={type} placeholder={placeholder} {...rest} />
      </div>
    );
  }
);

export default Input;
