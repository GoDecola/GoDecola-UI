import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

export const CustomPasswordField = ({ label, name, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required
      type={showPassword ? 'text' : 'password'}
      variant="standard"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon sx={{ color: 'var(--icons-login-color)' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              sx={{ color: 'var(--icons-login-color)' }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        width: "100%",
        '& .MuiInput-input': {
          color: 'var(--primary-text-color)',
        },
        "&:hover .MuiInput-input": {
          color: "var(--primary-text-color)",
        },
        "&:hover .MuiInputLabel-root": {
          color: "var(--orange-avanade)",
        },
        "& .MuiInputLabel-root": {
          color: "var(--icons-login-color)",
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: "var(--icons-login-color)",
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "var(--orange-avanade)",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "var(--orange-avanade)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--orange-avanade)",
        },
      }}
    />
  );
};