import "./LoginPage.css";
import logo from "../../assets/go_decola_logo_01.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  goToForgotPassword,
  goToSignUp,
  goToHome,
  goToHomeAdmin,
  goToHomeSupport,
} from "../../routes/coordinator";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import LockIcon from "@mui/icons-material/Lock";
import { useForm } from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { fetchCurrentUser } from "../../store/actions/userActions";
import { login } from "../../services/authService";
import { parseJwt } from "../../utils/jwt";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { form, onChangeForm, resetForm } = useForm({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = { email: "", password: "" };
    let valid = true;

    if (!validateEmail(form.email)) {
      tempErrors.email = "E-mail inválido.";
      valid = false;
    }

    if (!validatePassword(form.password)) {
      tempErrors.password = "Senha deve ter ao menos 6 caracteres.";
      valid = false;
    }

    setErrors(tempErrors);

    if (!valid) {
      document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      const response = await login({
        email: form.email,
        password: form.password,
      });

      const { token } = response;
      const payload = parseJwt(token);
      const userId = payload?.nameid || payload?.sub || null;
      const role = parseJwt(token).role;

      if (!userId) throw new Error("ID do usuário não encontrado no token");

      dispatch(loginSuccess({ token, userId }));

      try {
        const userData = await dispatch(fetchCurrentUser()).unwrap();
        console.log("Usuário carregado:", userData);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }

      resetForm();

      switch (role) {
        case "USER":
          goToHome(navigate);
          break;
        case "ADMIN":
          goToHomeAdmin(navigate);
          break;
        case "SUPPORT":
          goToHomeSupport(navigate);
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      const errorMessage =
        error.response?.data?.message || "E-mail ou senha incorretos.";
      setErrors({
        password: errorMessage,
      });
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  return (
    <div className="Logincontainer">
      {/* Lado esquerdo */}
      <div className="left">
        <img src={logo} alt="Go Decola" className="logo" />
        <h2>GO Decola</h2>
        <p>Sua próxima aventura começa aqui!</p>
        <p>Descubra destinos incríveis com os melhores preços.</p>
        <p>
          Pacotes exclusivos, passagens baratas e experiências inesquecíveis.
        </p>
      </div>

      <div className="divider"></div>

      {/* Lado direito */}
      <div className="right">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo de e-mail */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              width: "94%",
              ml: 1,
              mb: 2,
            }}
          >
            <AccountCircle sx={{ color: "black", mr: 1, my: 0.5 }} />
            <FormControl
              sx={{ width: "100%" }}
              variant="standard"
              error={Boolean(errors.email)}
            >
              <InputLabel htmlFor="input-email">E-mail</InputLabel>
              <Input
                id="input-email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChangeForm}
              />
              {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
            </FormControl>
          </Box>

          {/* Campo de senha */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              width: "94%",
              ml: 1,
              mb: 2,
            }}
          >
            <LockIcon sx={{ color: "black", mr: 1, my: 0.5 }} />
            <FormControl
              sx={{ width: "100%" }}
              variant="standard"
              error={Boolean(errors.password)}
            >
              <InputLabel htmlFor="standard-adornment-password">
                Senha
              </InputLabel>
              <Input
                id="standard-adornment-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onChangeForm}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <FormHelperText>{errors.password}</FormHelperText>
              )}
            </FormControl>
          </Box>

          <div onClick={() => goToForgotPassword(navigate)} className="forgot">
            Esqueci minha senha
          </div>

          <div className="login-between">
            <p className="text-end">
              <span className="highlight-orange">
                TA A FIM DE VIAJAR ?<br />
              </span>
              <span className="highlight-orange">
                VEM DE <strong className="highlight-purple"> GO DECOLA </strong>
              </span>
            </p>
            <button type="submit" className="login-btn">
              LOGAR
            </button>
          </div>

          <div onClick={() => goToSignUp(navigate)} className="cadastro">
            Não possui cadastro? Cadastre-se
          </div>
        </form>
      </div>
    </div>
  );
}
