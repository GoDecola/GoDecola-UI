import { FormControlLabel, Checkbox } from "@mui/material";

export const CustomCheckbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleChange = (event) => {
    onChange({
      target: {
        name,
        value: event.target.checked,
      },
    });
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          sx={{
            color: "var(--text-footer)",

            "&.Mui-checked": {
              color: "var(--orange-avanade)",
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&.Mui-disabled": {
              color: "var(--text-footer)",
              "&.Mui-checked": {
                color: "var(--icons-login-color)",
              },
            },
          }}
        />
      }
      label={label}
      sx={{
        "& .MuiFormControlLabel-label": {
          color: checked ? "var(--orange-avanade)" : "var(--text-footer)",
        },
        "& .MuiFormControlLabel-label.Mui-disabled": {
          color: "var(--no-active-tab)",
        },
      }}
    />
  );
};
