import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import BookingModal from "./BookingModal";
import { formatDate } from "../../../utils/formatDate";
import { fetchBookings } from "../../../store/actions/bookingActions";

const BookingsAdminTable = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleViewClick = (id) => {
    const booking = bookings.find((b) => b.id === id);
    setSelectedBooking(booking);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedBooking(null);
  };

  const statusColors = {
    Pendente: "#FFA500",
    Confirmada: "#4CAF50",
    Usada: "#2196F3",
    Cancelada: "#F44336",
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 70 },
    { field: "userId", headerName: "ID do Usuário", minWidth: 290 },
    { field: "travelPackageId", headerName: "ID do Pacote", minWidth: 100 },
    {
      field: "checkInDate",
      headerName: "Data de Check-in",
      minWidth: 140,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "checkOutDate",
      headerName: "Data de Check-out",
      minWidth: 140,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "reservationDate",
      headerName: "Data da Reserva",
      minWidth: 140,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography sx={{ color: statusColors[value] || "#000000" }}>
          {value}
        </Typography>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Preço Total (R$)",
      minWidth: 120,
      type: "string",
      cellClassName: "align-left",
      headerClassName: "align-left-header",
    },
    {
      field: "actions",
      headerName: "Ação",
      minWidth: 100,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleViewClick(params.row.id)}
            color="default"
            aria-label="Visualizar reserva"
            sx={{ color: "var(--icons-login-color)" }}
          >
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = bookings.map((booking) => ({
    id: booking.id,
    userId: booking.userId,
    travelPackageId: booking.travelPackageId,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    reservationDate: booking.reservationDate,
    status: booking.status,
    totalPrice: booking.totalPrice,
  }));

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
      {loading && (
        <Typography color="var(--primary-text-color)">Carregando...</Typography>
      )}
      {error && <Typography color="error">Erro: {error}</Typography>}
      {!loading && !error && bookings.length === 0 && (
        <Typography color="var(--primary-text-color)">
          Nenhuma reserva disponível.
        </Typography>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20]}
        sx={{
          width: "100%",
          maxWidth: 1282,
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
        open={openDetails}
        onClose={handleCloseDetails}
        selectedBooking={selectedBooking}
        handleCloseDetails={handleCloseDetails}
        formatDate={formatDate}
      />
    </Paper>
  );
};

export default BookingsAdminTable;
