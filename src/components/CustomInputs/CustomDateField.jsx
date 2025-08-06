import TextField from "@mui/material/TextField";

export const CustomDateField = ({
  label,
  name,
  value,
  onChange,
  required,
  min,
  max,
  disabled = false,
}) => (
  <TextField
    label={label}
    name={name}
    type="date"
    variant="outlined"
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
    inputProps={{
      min,
      max,
    }}
    slotProps={{
      inputLabel: {
        shrink: true,
      },
    }}
    sx={{
      width: "100%",
      input: {
        color: "var(--text-footer)",
      },

      "& .MuiInputBase-input.Mui-disabled": {
        color: "var(--no-active-tab)",
        WebkitTextFillColor: "var(--no-active-tab)",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--no-active-tab) !important",
      },
      "&:hover input": {
        color: "var(--icons-login-color)",
      },

      "& .MuiInputLabel-root": {
        color: "var(--icons-login-color)",
      },

      "&:hover .MuiInputLabel-root": {
        color: "var(--icons-login-color)",
      },

      "& .MuiInputLabel-root.Mui-focused": {
        color: "var(--orange-avanade)",
      },

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "var(--icons-login-color)",
        },

        "&:hover fieldset": {
          borderColor: "var(--orange-avanade)",
        },

        "&.Mui-focused fieldset": {
          borderColor: "var(--orange-avanade)",
        },
      },

      "& input[type='date']::-webkit-calendar-picker-indicator": {
        filter:
          "invert(58%) sepia(87%) saturate(748%) hue-rotate(345deg) brightness(95%) contrast(94%)",
        cursor: "pointer",
      },
    }}
  />
);
