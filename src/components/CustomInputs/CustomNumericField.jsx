import { TextField } from "@mui/material";
import React from "react";
import { IMaskInput } from "react-imask";

export const MaskedInput = React.forwardRef(function MaskedInput(props, ref) {
  const { onChange, name, mask, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask={
        mask ||
        (name.includes("latitude") || name.includes("longitude")
          ? Number
          : undefined)
      }
      definitions={{
        "#": /[0-9]/,
      }}
      scale={
        name.includes("latitude") || name.includes("longitude") ? 10 : undefined
      } // Permitir até 10 casas decimais
      radix={
        name.includes("latitude") || name.includes("longitude")
          ? "."
          : undefined
      } // Usar ponto como separador decimal
      inputRef={ref}
      onAccept={(value) => {
        console.log("MaskedInput onAccept:", { name, value });
        onChange({
          target: {
            name,
            value,
          },
        });
      }}
      overwrite
    />
  );
});

export const CustomNumericField = ({
  label,
  name,
  value,
  onChange,
  mask,
  required = true,
  disabled = false,
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      variant="standard"
      required={required}
      disabled={disabled}
      slotProps={{
        input: {
          inputComponent: MaskedInput,
          inputProps: {
            name,
            onChange,
            mask,
            value: value || "",
          },
        },
      }}
      sx={{
        width: "100%",
        input: { color: "var(--text-footer)" },
        "& .MuiInputBase-input.Mui-disabled": {
          color: "var(--no-active-tab)",
          WebkitTextFillColor: "var(--no-active-tab)",
        },
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
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--orange-avanade)",
        },
      }}
    />
  );
};
