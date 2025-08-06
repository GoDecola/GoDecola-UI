import { Typography, Box, Button } from "@mui/material";
import { goToHome } from "../../routes/coordinator";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const PaymentCancelPage= () => {
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
        Sinto muito, seu pagamento foi cancelado!
      </Typography>

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

export default PaymentCancelPage;
