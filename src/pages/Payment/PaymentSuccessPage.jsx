import { Typography, Box, Button } from "@mui/material";
import { goToHistory } from "../../routes/coordinator";
import { useNavigate, useLocation } from "react-router-dom"; // Importe useLocation
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');

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
        Sucesso, seu pagamento foi realizado!
      </Typography>

      <Typography variant="body1">
        Session ID: {sessionId}
      </Typography>
      <Typography variant="body1">
        Payment ID: {paymentId}
      </Typography>
      
      <Button
        onClick={() => goToHistory(navigate)}
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
       Ir para o histórico de reservas
      </Button>
    </Box>
  );
};

export default PaymentSuccessPage;