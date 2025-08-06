import { useState } from "react";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { deleteTravelPackageById } from "../../../../store/actions/travelPackagesActions";
import PackageModal from "./PackageModal";

const PackagesList = ({ packages, loading, error, onEdit, role }) => {
  const columns = [
    { field: "id", headerName: "ID", minWidth: 70 },
    { field: "title", headerName: "Título", minWidth: 218 },
    {
      field: "destination",
      headerName: "Destino",
      minWidth: 110,
    },
    {
      field: "price",
      headerName: "Preço em (R$)",
      minWidth: 120,

      type: "number",
      cellClassName: "align-left",
      headerClassName: "align-left-header",
    },
    {
      field: "type",
      headerName: "Tipo",
      minWidth: 120,
    },
    {
      field: "startDate",
      headerName: "Data de Início",
      minWidth: 120,
      valueFormatter: (value) =>
        new Date(value).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      field: "endDate",
      headerName: "Data de Término",
      minWidth: 120,
      valueFormatter: (value) =>
        new Date(value).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      field: "averageRating",
      headerName: "Avaliação",
      migrants: { type: "number" },
      minWidth: 90,
      type: "number",
      valueGetter: () => 0, // Placeholder até a API retornar
    },

    {
      field: "isCurrentlyOnPromotion",
      headerName: "Promoção",
      minWidth: 100,
      renderCell: ({ value }) => {
        return value ? "Sim" : "Não";
      },
    },

    {
      field: "isActive",
      headerName: "Ativo",
      minWidth: 80,
      renderCell: ({ value }) => (value ? "Sim" : "Não"),
    },
    {
      field: "actions",
      headerName: role === "ADMIN" ? "Ações" : "Ação",
      minWidth: 130,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => params.row.onView(params.row.id)}
            color="default"
            aria-label="Visualizar pacote"
            sx={{ color: "var(--icons-login-color)" }}
          >
            <Visibility />
          </IconButton>
          {role === "ADMIN" ? (
            <>
              <IconButton
                onClick={() => params.row.onEdit(params.row.id)}
                color="primary"
                aria-label="Editar pacote"
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => params.row.onDelete(params.row.id)}
                color="error"
                aria-label="Excluir pacote"
              >
                <Delete />
              </IconButton>
            </>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
  ];

  const dispatch = useDispatch();
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const handleViewClick = (id) => {
    const pkg = packages.find((p) => p.id === id);
    setSelectedPackage(pkg);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedPackage(null);
  };

  const handleDeleteClick = (id) => {
    setPackageToDelete(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setPackageToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteTravelPackageById(packageToDelete)).unwrap();
      handleCloseDelete();
    } catch (err) {
      console.error(err.message || "Erro ao excluir o pacote");
    }
  };

  const rows = packages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    destination: pkg.destination,
    price: pkg.price,
    type: pkg.packageType,
    startDate: pkg.startDate,
    endDate: pkg.endDate,
    averageRating: 0,
    isCurrentlyOnPromotion: pkg.isCurrentlyOnPromotion,
    isActive: pkg.isActive,
    onEdit,
    onDelete: handleDeleteClick,
    onView: handleViewClick,
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
      {!loading && !error && packages.length === 0 && (
        <Typography color="var(--primary-text-color)">
          Nenhum pacote disponível.
        </Typography>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20]}
        sx={{
          width: "100%",
          maxWidth: 1370,
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
      <PackageModal
        open={openDetails}
        onClose={handleCloseDetails}
        selectedPackage={selectedPackage}
        handleCloseDetails={handleCloseDetails}
      />
      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-confirm-dialog-title"
      >
        <DialogTitle id="delete-confirm-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este pacote? Esta ação não pode
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDelete}
            variant="outlined"
            sx={{
              borderColor: "var(--orange-avanade)",
              color: "var(--orange-avanade)",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ color: "white" }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PackagesList;
