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
} from "@mui/material";
import { convertDateString } from "../../../utils/formatDate";
import {
  getAllPayments,
  updatePaymentStatus,
} from "../../../store/actions/paymentActions";

const PaymentsAdminTable = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);
  const [loadingStatus, setLoadingStatus] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(getAllPayments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: "error" });
    }
  }, [error]);
  console.log("Payments data:", payments); // Debug payments data

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
      minWidth: 160,
      renderCell: ({ value }) => {
        const formattedDate = convertDateString(value);
        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      field: "amountPaid",
      headerName: "Valor Pago (R$)",
      minWidth: 120,
      type: "string",
      cellClassName: "align-left",
      headerClassName: "align-left-header",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
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
    { field: "reservationId", headerName: "ID da Reserva", minWidth: 120 },
    {
      field: "reservationStatus",
      headerName: "Status da Reserva",
      minWidth: 150,
      renderCell: ({ value }) => (
        <Typography sx={{ color: statusColors[value] || "#000000" }}>
          {value}
        </Typography>
      ),
    },
  ];

  const rows = payments.map((payment) => {
    console.log("Payment data:", payment); // Debug payment data
    return {
      id: payment.id,
      reservationId: payment.reservationId,
      paymentDate: payment.paymentDate,
      amountPaid: payment.amountPaid / 100,
      status: payment.status,
      reservationStatus: payment.reservationStatus,
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
      {loading && (
        <Typography color="var(--primary-text-color)">Carregando...</Typography>
      )}
      {error && <Typography color="error">Erro: {error}</Typography>}
      {!loading && !error && payments.length === 0 && (
        <Typography color="var(--primary-text-color)">
          Nenhum pagamento disponível.
        </Typography>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20]}
        sx={{
          width: "100%",
          maxWidth: '852px',
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
