import "./BookButton.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { goToBookings, goToLogin } from "../../../routes/coordinator";
import {
  Box,
  Button,
  Typography,
  Tooltip,  
} from "@mui/material";
import { formatDate } from "../../../utils/formatDate";
import { useState } from "react";

export const BookButton = ({ packageData }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated || !!state.auth.token
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const calculateDiscountedPrice = (price, discountPercentage) =>
    price * (1 - discountPercentage);

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setTooltipOpen(true);
      return;
    }
    goToBookings(navigate, packageData);
  };

  const handleMouseEnter = () => {
    if (!isAuthenticated) {
      setTooltipOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isAuthenticated) {
      setTooltipOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--background-color-invert)",
        transition: "background-color 0.25s ease-in-out",
        px: { xs: 2, sm: 3, md: 5 },
        height: { xs: 60, sm: 70, md: 80 },
        position: "fixed",
        width: "100%",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1500,
        color: "var(--secondary-text-color)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {packageData.isCurrentlyOnPromotion ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "var(--secondary-text-color)",
                  fontSize: { xs: "1.0rem", sm: "1.3rem", md: "1.7rem" },
                }}
              >
                R$ {packageData.price}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "var(--orange-avanade)",
                  fontWeight: "bold",
                  fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2.1rem" },
                  ml: -1,
                }}
              >
                R${" "}
                {calculateDiscountedPrice(
                  packageData.price,
                  packageData.discountPercentage
                ).toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: "var(--secondary-text-color)",
                fontWeight: "bold",
                fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2.1rem" },
              }}
            >
              R$ {packageData.price}
            </Typography>
          )}
        </Box>
        {packageData.isCurrentlyOnPromotion && (
          <Typography
            variant="body2"
            sx={{
              color: "var(--secondary-text-color)",
              mt: { xs: "-21px", md: "0px" },
              fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
            }}
          >
            • Promoção: {formatDate(packageData.promotionStartDate)} à{" "}
            {formatDate(packageData.promotionEndDate)}
          </Typography>
        )}
      </Box>

      <div>
        <Tooltip
          title={
            isAuthenticated ? (
              ""
            ) : (
              <span>
                Você precisa estar logado para reservar.{" "}
                <Typography
                  component="span"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToLogin(navigate);
                  }}
                  sx={{
                    color: "var(--orange-avanade)",
                    textDecoration: "underline",
                    cursor: "pointer",
                    textAlign: "right",
                  }}
                >
                  Faça login
                </Typography>
              </span>
            )
          }
          open={tooltipOpen && !isAuthenticated}
          disableHoverListener={isAuthenticated}
          arrow
          placement="top"
          leaveDelay={3000}
          disableFocusListener
          disableTouchListener
          PopperProps={{
            modifiers: [
              {
                name: "preventOverflow",
                options: {
                  altAxis: true,
                  tether: false,
                },
              },
              {
                name: "offset",
                options: {
                  offset: [0, 8],
                },
              },
            ],
          }}
          sx={{
            "& .MuiTooltip-tooltip": {
              backgroundColor: "var(--background-color, #fff)",
              color: "var(--primary-text-color, #000)",
              fontSize: "0.9rem",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--orange-avanade, #f28c38)",
              zIndex: 1500,
              maxWidth: 200,
            },
            "& .MuiTooltip-arrow": {
              color: "var(--background-color, #fff)",
              "&::before": {
                border: "1px solid var(--orange-avanade, #f28c38)",
              },
            },
            ...(isAuthenticated
              ? {}
              : {
                  opacity: 0.6,
                  cursor: "not-allowed",
                }),
          }}
        >
          <Button
            variant="contained"
            onClick={handleBookClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              textTransform: "none",
              color: "white",
              background: isAuthenticated
                ? "var(--orange-avanade-invert)"
                : "var(--orange-avanade, #f28c38)",
              borderRadius: "15px",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
              fontWeight: "bold",
              py: { xs: 0.5, sm: 1 },
              px: { xs: 2, sm: 3, md: 4 },
              fontFamily:
                '"Segoe UI", OpenSans, Roboto, Arial, Tahoma, Helvetica, sans-serif',
              "&:hover": {
                background: isAuthenticated
                  ? "var(--orange-avanade)"
                  : "var(--orange-avanade, #f28c38)",
              },
              opacity: isAuthenticated ? 1 : 0.6,
              cursor: isAuthenticated ? "pointer" : "not-allowed",
            }}
          >
            Reservar
          </Button>
        </Tooltip>
      </div>
    </Box>
  );
};
