import { TextField } from "@mui/material";
import { NumericFormat } from 'react-number-format';

export const CustomPriceField = ({
  label,
  name,
  value,
  onChange,
  mask = {},
  disabled = false,
}) => {
  return (
    <NumericFormat
      customInput={TextField}
      label={label}
      name={name}
      value={value}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
      variant="standard"
      required
      thousandSeparator={mask.thousandSeparator}
      decimalSeparator={mask.decimalSeparator}
      decimalScale={mask.decimalScale}
      fixedDecimalScale={mask.fixedDecimalScale}
      prefix={mask.prefix}
      disabled={disabled}
      sx={{
        width:'100%',
        input: { color: "var(--text-footer)" },
        "&:hover input": { color: "var(--icons-login-color)" },
        "&:hover .MuiInputLabel-root": { color: "var(--icons-login-color)" },
        "& .MuiInputLabel-root": { color: "var(--icons-login-color)" },
        "& .MuiInput-underline:before": {
          borderBottomColor: "var(--icons-login-color)",
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "var(--orange-avanade)",
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottomColor: "var(--orange-avanade)",
        },
        "& .MuiInputBase-root.Mui-focused": { color: "var(--orange-avanade)" },
        "& .MuiInputLabel-root.Mui-focused": { color: "var(--orange-avanade)" },
      }}
    />
  );
};