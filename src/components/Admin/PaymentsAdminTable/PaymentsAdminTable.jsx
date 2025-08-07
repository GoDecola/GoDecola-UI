import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { convertDateString } from "../../../utils/formatDate";
import {
  getAllPayments,
  updatePaymentStatus,
} from "../../../store/actions/paymentActions";
import { fetchBookings } from "../../../store/actions/bookingActions";
import { fetchUsers } from "../../../store/actions/userActions";
import BookingModal from "../BookingsAdminTable/BookingModal";
import UserModal from "../UsersAdminTable/UsersList/UserModal";

const PaymentsAdminTable = () => {
  const dispatch = useDispatch();
  const {
    payments = [],
    loading: paymentLoading = false,
    error: paymentError = null,
  } = useSelector((state) => state.payments || {});
  const {
    bookings = [],
    loading: bookingLoading = false,
    error: bookingError = null,
  } = useSelector((state) => state.bookings || {});
  const {
    users = [],
    loading: userLoading = false,
    error: userError = null,
  } = useSelector((state) => state.user || {});
  const [loadingStatus, setLoadingStatus] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openBookingDetails, setOpenBookingDetails] = useState(false);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getAllPayments());
    dispatch(fetchBookings());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (paymentError || bookingError || userError) {
      setSnackbar({
        open: true,
        message: paymentError || bookingError || userError,
        severity: "error",
      });
    }
  }, [paymentError, bookingError, userError]);

  const handleStatusChange = (paymentId, newStatus) => {
    setLoadingStatus((prev) => ({ ...prev, [paymentId]: true }));
    dispatch(updatePaymentStatus({ paymentId, status: newStatus }))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: `Status do pagamento ${paymentId} atualizado para ${newStatus}`,
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Status update error:", err);
        setSnackbar({
          open: true,
          message: err.message || err || "Erro ao atualizar status",
          severity: "error",
        });
      })
      .finally(() => {
        setLoadingStatus((prev) => ({ ...prev, [paymentId]: false }));
      });
  };

  const handleBookingViewClick = (reservationId) => {
    const booking = bookings.find((b) => b.id === reservationId);
    if (booking) {
      setSelectedBooking(booking);
      setOpenBookingDetails(true);
    } else {
      setSnackbar({
        open: true,
        message: "Reserva não encontrada",
        severity: "warning",
      });
    }
  };

  const handleUserViewClick = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setOpenUserDetails(true);
    } else {
      setSnackbar({
        open: true,
        message: "Usuário não encontrado",
        severity: "warning",
      });
    }
  };

  const handleBookingCloseDetails = () => {
    setOpenBookingDetails(false);
    setSelectedBooking(null);
  };

  const handleUserCloseDetails = () => {
    setOpenUserDetails(false);
    setSelectedUser(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const statusColors = {
    PENDING: "#FFA500",
    CONFIRMED: "#4CAF50",
    FAILED: "#F44336",
    CANCELLED: "#9E9E9E",
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 100 },
    {
      field: "paymentDate",
      headerName: "Data do Pagamento",
      minWidth: 180,
      renderCell: ({ value }) => {
        const formattedDate = convertDateString(value);
        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      field: "amountPaid",
      headerName: "Valor Pago (R$)",
      minWidth: 130,
      type: "string",
      cellClassName: "align-left",
      headerClassName: "align-left-header",
    },
    {
      field: "status",
      headerName: "Status do Pagamento",
      minWidth: 180,
      renderCell: ({ row }) => (
        <Select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          disabled={loadingStatus[row.id]}
          sx={{
            color: statusColors[row.status] || "#000000",
            minWidth: 120,
            height: 40,
            "& .MuiSelect-select": {
              padding: "8px",
            },
          }}
        >
          {["PENDING", "CONFIRMED", "FAILED", "CANCELLED"].map((status) => (
            <MenuItem key={status} value={status}>
              <Typography sx={{ color: statusColors[status] || "#000000" }}>
                {status}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "reservationId",
      headerName: "ID da Reserva",
      minWidth: 140,
      renderCell: ({ value }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => handleBookingViewClick(value)}
            color="default"
            aria-label="Visualizar reserva"
            sx={{ color: "var(--icons-login-color)" }}
          >
            <Visibility />
          </IconButton>
          <Typography>{value}</Typography>
        </Box>
      ),
    },
    {
      field: "reservationStatus",
      headerName: "Status da Reserva",
      minWidth: 170,
      renderCell: ({ value }) => (
        <Typography sx={{ color: statusColors[value] || "#000000" }}>
          {value}
        </Typography>
      ),
    },
    {
      field: "userEmail",
      headerName: "Email do Usuário",
      minWidth: 398,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => handleUserViewClick(row.userId)}
            color="default"
            aria-label="Visualizar usuário"
            sx={{ color: "var(--icons-login-color)" }}
          >
            <Visibility />
          </IconButton>
          <Typography>{row.userEmail}</Typography>
        </Box>
      ),
    },
  ];

  const rows = payments.map((payment) => {
    const booking = bookings.find((b) => b.id === payment.reservationId);
    const user = users.find((u) => u.id === (booking ? booking.userId : null));
    return {
      id: payment.id,
      reservationId: payment.reservationId,
      paymentDate: payment.paymentDate,
      amountPaid: payment.amountPaid / 100,
      status: payment.status,
      reservationStatus: payment.reservationStatus,
      userId: booking ? booking.userId : "N/A",
      userEmail: user ? user.email : "N/A",
    };
  });

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper
      sx={{
        height: "auto",
        width: "100%",
        backgroundColor: "var(--footer-bg)",
        boxShadow: "none",
      }}
    >
      {(paymentLoading || bookingLoading || userLoading) && (
        <Typography color="var(--primary-text-color)">Carregando...</Typography>
      )}
      {(paymentError || bookingError || userError) && (
        <Typography color="error">
          Erro: {paymentError || bookingError || userError}
        </Typography>
      )}
      {!paymentLoading &&
        !bookingLoading &&
        !userLoading &&
        !paymentError &&
        !bookingError &&
        !userError &&
        payments.length === 0 && (
          <Typography color="var(--primary-text-color)">
            Nenhum pagamento disponível.
          </Typography>
        )}
      <Box sx={{ width: "100%", textAlign: "center", mt: { xs: 4, md: 1 } }}>
        <Typography
          variant="h5"
          sx={{ color: "var(--orange-avanade)", fontWeight: "bold", mb: 3 }}
        >
          Gerenciamento dos Pagamentos
        </Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20]}
        sx={{
          width: "100%",
          maxWidth: "1330px",
          margin: "0 auto",
          p: 2,
          backgroundColor: "var(--footer-bg)",
          border: 0,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "var(--orange-avanade)",
            color: "var(--secondary-text-color)",
          },
          "& .MuiDataGrid-cell": {
            color: "var(--text-footer)",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(255, 165, 0, 0.1)",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(255, 165, 0, 0.25)",
            },
          },
          "& .MuiTablePagination-toolbar": {
            color: "var(--text-footer)",
          },
          "& .MuiTablePagination-root": {
            color: "var(--text-footer)",
          },
          "& .MuiTablePaginationActions-root .MuiIconButton-root": {
            color: "var(--no-active-tab)",
          },
          "& .MuiTablePagination-root .MuiSelect-icon": {
            color: "var(--text-footer)",
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "var(--secondary-text-color)",
          },
        }}
      />
      <BookingModal
        open={openBookingDetails}
        onClose={handleBookingCloseDetails}
        selectedBooking={selectedBooking}
        handleCloseDetails={handleBookingCloseDetails}
        formatDate={convertDateString}
      />
      <UserModal
        open={openUserDetails}
        onClose={handleUserCloseDetails}
        selectedUser={selectedUser}
        handleCloseDetails={handleUserCloseDetails}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PaymentsAdminTable;
