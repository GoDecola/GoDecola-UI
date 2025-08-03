import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { formatDate } from "../../../../utils/formatDate";

const UserModal = ({ open, onClose, selectedUser, handleCloseDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes do Usuário</DialogTitle>
      <DialogContent>
        {selectedUser && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle1">
              <strong>ID:</strong> {selectedUser.id}
            </Typography>
            <Typography variant="body2">
              <strong>Nome:</strong> {selectedUser.firstName}
            </Typography>
            <Typography variant="body2">
              <strong>Sobrenome:</strong> {selectedUser.lastName}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {selectedUser.email}
            </Typography>
            <Typography variant="body2">
              <strong>Documento:</strong> {selectedUser.document}
            </Typography>
            <Typography variant="body2">
              <strong>Passaporte:</strong> {selectedUser.passaport || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Data de Criação:</strong>{" "}
              {formatDate(selectedUser.createdAt)}
            </Typography>
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

export default UserModal;
