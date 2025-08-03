import UnauthorizedUser from "../../assets/UnauthorizedUser.png";
import { Typography, Box, Button } from "@mui/material";
import { goToHome } from "../../routes/coordinator";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "var(--background-color)",
        minHeight: "75vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
        color: "var(--primary-text-color)",
      }}
    >
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{
          fontSize: {
            xs: "10rem",
            sm: "12rem",
            md: "14rem",
          },
        }}
      >
        401
      </Typography>
      <Typography
        variant="h3"
        sx={{
          mt: -5,
          fontSize: {
            xs: "1.5rem",
            sm: "2rem",
            md: "2.5rem",
          },
        }}
      >
        Autorização requerida!
      </Typography>
      <Box
        component="img"
        src={UnauthorizedUser}
        alt="Autorização requerida!"
        sx={{ maxWidth: "100%", height: "auto", filter: "var(--logo-filter)" }}
      />

      <Button
        onClick={() => goToHome(navigate)}
        variant="outlined"
        startIcon={<ArrowBackIosIcon sx={{ color: "var(--orange-avanade)" }} />}
        sx={{
          borderColor: "var(--orange-avanade)",
          color: "var(--orange-avanade)",
          "&:hover": {
            backgroundColor: "rgba(255, 165, 0, 0.08)",
            borderColor: "var(--orange-avanade)",
          },
          textTransform: "none",
          fontSize: "1rem",
        }}
      >
        Voltar para página inicial
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
