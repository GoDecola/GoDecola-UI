import { useState } from "react";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import {
  deleteUserById,
  fetchUsers,
} from "../../../../store/actions/userActions";
import UserModal from "./UserModal";
import { formatDate } from "../../../../utils/formatDate";

const UserList = ({ clients, loading, error, onEdit, role }) => {
  const dispatch = useDispatch();
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleViewClick = (id) => {
    const user = clients.find((u) => u.id === id);
    setSelectedUser(user);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUserById(userToDelete)).unwrap();
      handleCloseDelete();
      dispatch(fetchUsers());
    } catch (err) {
      console.error(err.message || "Erro ao excluir o usuário");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 300 },
    { field: "firstName", headerName: "Nome", minWidth: 150 },
    { field: "lastName", headerName: "Sobrenome", minWidth: 198 },
    { field: "email", headerName: "Email", minWidth: 200 },
    { field: "document", headerName: "Documento", minWidth: 120 },
    { field: "passaport", headerName: "Passaporte", minWidth: 120 },
    {
      field: "createdAt",
      headerName: "Data de Criação",
      minWidth: 120,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      headerName: role === "ADMIN" ? "Ações" : "Ação",
      minWidth: 130,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleViewClick(params.row.id)}
            color="default"
            aria-label="Visualizar usuário"
            sx={{ color: "var(--icons-login-color)" }}
          >
            <Visibility />
          </IconButton>
          {role === "ADMIN" && (
            <>
              <IconButton
                onClick={() => params.row.onEdit(params.row.id)}
                color="primary"
                aria-label="Editar usuário"
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => params.row.onDelete(params.row.id)}
                color="error"
                aria-label="Excluir usuário"
              >
                <Delete />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const rows = Array.isArray(clients)
    ? clients.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        document: user.document,
        passaport: user.passaport || "N/A",
        createdAt: user.createdAt,
        onEdit,
        onDelete: handleDeleteClick,
        onView: handleViewClick,
      }))
    : [];

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
      {!loading && !error && (!clients || clients.length === 0) && (
        <Typography color="var(--primary-text-color)">
          Nenhum usuário disponível.
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
          "& .MuiDataGrid-filler": {
            backgroundColor: "var(--orange-avanade)",
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
      <UserModal
        open={openDetails}
        onClose={handleCloseDetails}
        selectedUser={selectedUser}
        handleCloseDetails={handleCloseDetails}
      />
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente excluir este usuário?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ color: "white" }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserList;
