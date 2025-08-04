import { useTheme } from "../../hooks/useTheme";
import { Toggle } from "./Toggle/Toggle";
import { useNavigate } from "react-router-dom";
import { goToHome, goToHistory, goToWishList } from "../../routes/coordinator";
import "./Header.css";
import logoDesktop from "../../assets/go_decola_logo_02_v1.png";
import logoMobile from "../../assets/go_decola_logo_01_v1.png";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "../../store/actions/userActions";
import { HeaderLogoutButton } from "./HeaderLogoutButton/HeaderLogoutButton";
import { HeaderLoginButton } from "./HeaderLoginButton/HeaderLoginButton";
import { FaHeart } from "react-icons/fa";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Tooltip from "@mui/material/Tooltip";
import { parseJwt } from "../../utils/jwt";

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const payload = token ? parseJwt(token) : null;
  
  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, loading, dispatch]);

  return (
    <header className="header">
      <img
        src={logoDesktop}
        alt="logotipo do Go Decola"
        className="logoDesktop"
        onClick={() => goToHome(navigate)}
      />
      <img
        src={logoMobile}
        alt="logotipo do Go Decola"
        className="logoMobile"
        onClick={() => goToHome(navigate)}
      />
      <div className="header-right">
        {user ? (
          payload?.role === "USER" ? (
            <>
              <Tooltip title="Favoritos" arrow>
                <FaHeart
                  size={30}
                  className="fa-heart-icon"
                  onClick={() => goToWishList(navigate)}
                />
              </Tooltip>
              <Tooltip title="Histórico" arrow>
                <EventNoteIcon
                  onClick={() => goToHistory(navigate)}
                  fontSize="large"
                  sx={{
                    marginLeft: 1,
                    cursor: "pointer",
                    color: "var(--secondary-text-color)",
                    "&:hover": {
                      color: "var(--no-active-tab)",
                    },
                  }}
                />
              </Tooltip>
              <HeaderLogoutButton user={user} />
            </>
          ) : (
            <HeaderLogoutButton user={user} />
          )
        ) : (
          <HeaderLoginButton />
        )}
        <Toggle handleChange={toggleTheme} isChecked={isDark} />
      </div>
    </header>
  );
};

export default Header;
