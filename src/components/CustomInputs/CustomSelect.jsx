import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  disabled = false,
}) => (
  <FormControl
    required={required}
    sx={{
      width: "100%",
      "& .MuiInputBase-input.Mui-disabled": {
        color: "var(--no-active-tab)",
        WebkitTextFillColor: "var(--no-active-tab)",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--no-active-tab) !important",
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
    }}
  >
    <InputLabel>{label}</InputLabel>
    <Select
      name={name}
      value={value}
      onChange={onChange}
      label={label}
      disabled={disabled}
      sx={{
        color: "var(--text-footer)",
        input: {
          color: "var(--text-footer)",
        },
        "&:hover input": {
          color: "var(--icons-login-color)",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--icons-login-color)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--orange-avanade)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--orange-avanade)",
        },
        "& .MuiSelect-icon": {
          color: "var(--icons-login-color)",
        },
        "&:hover .MuiSelect-icon": {
          color: "var(--orange-avanade)",
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "var(--orange-avanade)",
              color: "white",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "var(--orange-avanade)",
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
