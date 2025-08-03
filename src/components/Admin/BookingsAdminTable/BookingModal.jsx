import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Divider,
} from "@mui/material";

const BookingModal = ({ open, onClose, selectedBooking, handleCloseDetails, formatDate}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes da Reserva</DialogTitle>
      <DialogContent>
        {selectedBooking && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb:1 }}>
            <Typography variant="subtitle1">
              <strong>ID da Reserva:</strong> {selectedBooking.id}
            </Typography>
            <Typography variant="body2">
              <strong>ID do Usuário:</strong> {selectedBooking.userId}
            </Typography>
            <Typography variant="body2">
              <strong>Nome do Usuário:</strong>{" "}
              {selectedBooking.user.firstName} {selectedBooking.user.lastName}
            </Typography>
            <Typography variant="body2">
              <strong>Email do Usuário:</strong> {selectedBooking.user.email}
            </Typography>
            <Typography variant="body2">
              <strong>Data da Reserva:</strong>{" "}
              {formatDate(selectedBooking.reservationDate)}
            </Typography>
            <Typography variant="body2">
              <strong>Data de Check-in:</strong>{" "}
              {formatDate(selectedBooking.checkInDate)}
            </Typography>
            <Typography variant="body2">
              <strong>Data de Check-out:</strong>{" "}
              {formatDate(selectedBooking.checkOutDate)}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {selectedBooking.status}
            </Typography>
            <Typography variant="body2">
              <strong>Preço Total:</strong> R$ {selectedBooking.totalPrice}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Detalhes do Pacote</Typography>
            <Typography variant="body2">
              <strong>ID do Pacote:</strong>{" "}
              {selectedBooking.travelPackage.id}
            </Typography>
            <Typography variant="body2">
              <strong>Preço:</strong> R$ {selectedBooking.travelPackage.price}
            </Typography>
            <Typography variant="body2">
              <strong>Destino:</strong> {selectedBooking.travelPackage.destination}
            </Typography>
            <Typography variant="body2">
              <strong>Tipo:</strong> {selectedBooking.travelPackage.packageType}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Hóspedes</Typography>
            {selectedBooking.guests && selectedBooking.guests.length > 0 ? (
              selectedBooking.guests.map((guest, index) => (
                <Box key={guest.id} sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Hóspede {index + 1}:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nome:</strong> {guest.firstName} {guest.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {guest.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>CPF:</strong> {guest.cpf}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data de Nascimento:</strong>{" "}
                    {formatDate(guest.dateOfBirth)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", color: "text.secondary" }}
              >
                Nenhum hóspede registrado para esta reserva.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDetails}
          variant="contained"
          sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;