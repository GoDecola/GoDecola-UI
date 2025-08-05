import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Collapse,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { fetchBookingByUserId } from "../../store/actions/userActions";
import { formatDate } from "../../utils/formatDate";
import useIsMobile from "../../hooks/useIsMobile";
import { PackageCard } from "../../components/PackageCard/PackageCard";
import { goToPackageDetails } from "../../routes/coordinator";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    user,
    bookings = [],
    loading,
    error,
  } = useSelector((state) => state.user);
  const [expandedCards, setExpandedCards] = useState({});
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBookingByUserId(user.id));
    } else {
      setFormError("Usuário não autenticado");
    }
  }, [user, dispatch]);

  const handleToggleExpand = (bookingId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  const calculateDiscountedPrice = (price, discountPercentage) =>
    price * (1 - discountPercentage);

  const isBookingInPromotion = (booking) => {
    if (
      booking.travelPackage?.isCurrentlyOnPromotion &&
      booking.travelPackage?.promotionStartDate &&
      booking.travelPackage?.promotionEndDate &&
      booking.checkInDate
    ) {
      const checkInDate = new Date(booking.checkInDate);
      const promotionStart = new Date(booking.travelPackage.promotionStartDate);
      const promotionEnd = new Date(booking.travelPackage.promotionEndDate);
      return checkInDate >= promotionStart && checkInDate <= promotionEnd;
    }
    return false;
  };

  const getStatusLabelAndColor = (status) => {
    const map = {
      PENDING: { label: "Pendente", color: "#FFA500" },
      CONFIRMED: { label: "Confirmada", color: "#4CAF50" },
      USED: { label: "Usada", color: "#2196F3" },
      CANCELLED: { label: "Cancelada", color: "#F44336" },
    };
    return map[status] || { label: "Desconhecido", color: "#757575" };
  };

  return (
    <Box
      sx={{
        padding: "2rem",
        paddingBottom: "50px",
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--background-color)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "var(--background-color)",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          minHeight: "59vh",
          flexDirection: "column",
          gap: 2,
          maxWidth: "1330px",
          mx: "auto",
          pt: isMobile ? 3 : 5,
          pb: isMobile ? 0 : 20,
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ color: "var(--orange-avanade)", fontWeight: "bold" }}
          >
            Histórico de Reservas
          </Typography>
          {user && (
            <Typography
              variant="subtitle1"
              sx={{ color: "var(--text-footer)", mt: 1, mb: 2 }}
            >
              Olá, {user.firstName}! Aqui estão suas reservas.
            </Typography>
          )}
        </Box>
        {loading && (
          <Typography sx={{ color: "var(--primary-text-color)", mt: 10 }}>
            Carregando reservas...
          </Typography>
        )}

        {!loading && (!bookings || bookings.length === 0) && (
          <Typography sx={{ color: "var(--no-active-tab)", mt: 10 }}>
            Você ainda não possui nenhuma reserva ativa.
          </Typography>
        )}

        {bookings?.map((booking) => (
          <Box
            key={booking.id}
            sx={{
              borderRadius: "8px",
              p: isMobile ? 2 : 3,
              mb: 3,
              cursor: "pointer",
              backgroundColor: "var(--footer-bg)",
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 5,
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              <PackageCard
                id={booking.travelPackage?.id}
                title={booking.travelPackage?.title || "Pacote Indisponível"}
                price={
                  booking.travelPackage?.price
                    ? (booking.travelPackage.price / 100).toFixed(2)
                    : "0,00"
                }
                isCurrentlyOnPromotion={
                  booking.travelPackage?.isCurrentlyOnPromotion
                }
                discountPercentage={
                  booking.travelPackage?.discountPercentage || 0
                }
                averageRating={booking.travelPackage?.averageRating || null}
                imageSrc={booking.travelPackage?.mediasUrl}
                sx={{
                  flex: isMobile ? "1" : "0 0 30%",
                  maxWidth: isMobile ? "100%" : "30%",
                  borderRadius: "8px",
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? 1 : 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--primary-text-color)",
                    fontWeight: "bold",
                    lineHeight: isMobile ? 1.2 : 0.8,
                    mb: isMobile ? 1 : 0,
                  }}
                >
                  {booking.travelPackage?.title || "Pacote Indisponível"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)", lineHeight: 0.5 }}
                >
                  <strong>Destino:</strong>{" "}
                  {booking.travelPackage?.destination || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)", lineHeight: 0.5 }}
                >
                  <strong>Data da Reserva:</strong>{" "}
                  {formatDate(booking.reservationDate) || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)", lineHeight: 0.5 }}
                >
                  <strong>Check-in:</strong>{" "}
                  {formatDate(booking.checkInDate) || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)", lineHeight: 0.5 }}
                >
                  <strong>Check-out:</strong>{" "}
                  {formatDate(booking.checkOutDate) || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: getStatusLabelAndColor(booking.status).color,
                    lineHeight: 0.5,
                  }}
                >
                  <strong>Status:</strong>{" "}
                  {getStatusLabelAndColor(booking.status).label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)", lineHeight: 0.5 }}
                >
                  <strong>Preço:</strong>{" "}
                  {isBookingInPromotion(booking) ? (
                    <>
                      <span style={{ textDecoration: "line-through" }}>
                        R${" "}
                        {booking.travelPackage?.price
                          ? (booking.travelPackage.price / 100).toFixed(2)
                          : "0,00"}
                      </span>{" "}
                      <span style={{ color: "var(--orange-avanade)" }}>
                        R${" "}
                        {calculateDiscountedPrice(
                          booking.travelPackage?.price
                            ? (booking.travelPackage.price / 100).toFixed(2)
                            : "0,00",
                          booking.travelPackage?.discountPercentage || 0
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `R$ ${
                      booking.travelPackage?.price
                        ? (booking.travelPackage.price / 100).toFixed(2)
                        : "0,00"
                    }`
                  )}
                </Typography>
                <Button
                  onClick={() => handleToggleExpand(booking.id)}
                  variant="outlined"
                  sx={{
                    mt: 1,
                    borderColor: "var(--orange-avanade)",
                    color: "var(--orange-avanade)",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255, 102, 0, 0.1)",
                      borderColor: "var(--orange-avanade)",
                    },
                  }}
                  endIcon={
                    expandedCards[booking.id] ? <ExpandLess /> : <ExpandMore />
                  }
                >
                  {expandedCards[booking.id]
                    ? "Menos Detalhes"
                    : "Mais Detalhes"}
                </Button>
              </Box>
            </Box>
            <Collapse in={expandedCards[booking.id]}>
              <Divider sx={{ my: 2, borderColor: "var(--orange-avanade)" }} />
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "var(--primary-text-color)",
                    fontWeight: "bold",
                  }}
                >
                  Detalhes do Pacote
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)" }}
                >
                  <strong>Descrição:</strong>{" "}
                  {booking.travelPackage?.description || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)" }}
                >
                  <strong>Endereço:</strong>{" "}
                  {[
                    booking.travelPackage?.accommodationDetails?.address
                      ?.addressLine1,
                    booking.travelPackage?.accommodationDetails?.address
                      ?.addressLine2,
                    booking.travelPackage?.accommodationDetails?.address
                      ?.neighborhood,
                    booking.travelPackage?.accommodationDetails?.address?.city,
                    booking.travelPackage?.accommodationDetails?.address?.state,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)" }}
                >
                  <strong>Comodidades:</strong>{" "}
                  {[
                    booking.travelPackage?.accommodationDetails?.hasWifi &&
                      "Wi-Fi",
                    booking.travelPackage?.accommodationDetails?.hasParking &&
                      "Estacionamento",
                    booking.travelPackage?.accommodationDetails?.hasPool &&
                      "Piscina",
                    booking.travelPackage?.accommodationDetails?.hasGym &&
                      "Academia",
                    booking.travelPackage?.accommodationDetails
                      ?.hasRestaurant && "Restaurante",
                    booking.travelPackage?.accommodationDetails
                      ?.hasPetFriendly && "Pet-Friendly",
                    booking.travelPackage?.accommodationDetails
                      ?.hasAirConditioning && "Ar Condicionado",
                    booking.travelPackage?.accommodationDetails
                      ?.hasBreakfastIncluded && "Café da Manhã Incluído",
                  ]
                    .filter(Boolean)
                    .join(", ") || "Nenhuma"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)" }}
                >
                  <strong>Número de Banheiros:</strong>{" "}
                  {booking.travelPackage?.accommodationDetails?.numberBaths ||
                    "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-footer)" }}
                >
                  <strong>Número de Camas:</strong>{" "}
                  {booking.travelPackage?.accommodationDetails?.numberBeds ||
                    "N/A"}
                </Typography>
                {isBookingInPromotion(booking) && (
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-footer)" }}
                  >
                    <strong>Promoção:</strong>{" "}
                    {formatDate(booking.travelPackage?.promotionStartDate) ||
                      "N/A"}{" "}
                    à{" "}
                    {formatDate(booking.travelPackage?.promotionEndDate) ||
                      "N/A"}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2, borderColor: "var(--orange-avanade)" }} />
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "var(--primary-text-color)",
                    fontWeight: "bold",
                  }}
                >
                  Hóspedes
                </Typography>
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    justifyContent: "flex-start",
                  }}
                >
                  {(booking.guests || []).map((guest, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ mt: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--primary-text-color)",
                            fontWeight: "medium",
                          }}
                        >
                          Hóspede {index + 1}: {guest.firstName}{" "}
                          {guest.lastName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text-footer)" }}
                        >
                          <strong>Email:</strong> {guest.email || "N/A"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text-footer)" }}
                        >
                          {guest.cpf ? (
                            <>
                              <strong>CPF:</strong> {guest.cpf}
                            </>
                          ) : (
                            <>
                              <strong>RNE:</strong> {guest.rne || "N/A"}
                            </>
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text-footer)" }}
                        >
                          <strong>Data de Nascimento:</strong>{" "}
                          {formatDate(guest.dateOfBirth) || "N/A"}
                        </Typography>
                      </Box>

                      {index < booking.guests.length - 1 && (
                        <Divider
                          orientation={{ xs: "horizontal", sm: "vertical" }}
                          flexItem
                          sx={{
                            alignSelf: "stretch",
                            borderColor: "var(--icons-login-hover)",
                            borderWidth: "1px",
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Button
                onClick={() =>
                  goToPackageDetails(navigate, booking.travelPackage?.id)
                }
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "var(--orange-avanade)",
                  color: "white",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "var(--orange-avanade-invert)",
                  },
                }}
                disabled={!booking.travelPackage?.id}
              >
                Ver Pacote
              </Button>
            </Collapse>
          </Box>
        ))}
        <Snackbar
          open={!!formError || !!error}
          autoHideDuration={6000}
          onClose={() => setFormError(null)}
        >
          <Alert
            severity="error"
            onClose={() => setFormError(null)}
            sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
          >
            {formError || error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default HistoryPage;
