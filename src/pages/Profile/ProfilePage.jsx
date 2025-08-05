import "./ProfilePage.css";
import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { CustomTextfield } from "../../components/CustomInputs/CustomTextfield";
import { CustomTextfield_Disable_NOTRequired } from "../../components/CustomInputs/CustomTextfield_Disable_NOTRequired";
import { useForm } from "../../hooks/useForm";
import { updateUserById } from "../../store/actions/userActions";
import { fetchCurrentUser } from "../../store/actions/userActions";
import { CustomNumericField } from "../../components/CustomInputs/CustomNumericField";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const [formError, setFormError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasSuccessfulUpdate, setHasSuccessfulUpdate] = useState(
    !!user?.passaport
  );

  const { form, setForm, onChangeForm } = useForm({
    firstName: "",
    lastName: "",
    email: "",
    cpf: "",
    rne: "",
    passaport: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        cpf: user.document?.length === 11 ? user.document : "",
        rne: user.document?.length !== 11 ? user.document : "",
        passaport: user.passaport || "",
      });
      setHasSuccessfulUpdate(!!user?.passaport);
    }
  }, [user, setForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!user || !user.id) {
      setFormError("Dados do usuário não carregados. Tente novamente.");
      return;
    }
    // Validation
    if (!form.firstName || !form.lastName || !form.email) {
      setFormError("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("E-mail inválido");
      return;
    }
    if (form.passaport && !/^[A-Za-z0-9]{6,9}$/.test(form.passaport)) {
      setFormError(
        "Passaporte inválido: deve conter 6 a 9 caracteres alfanuméricos"
      );
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      document: user.document?.length === 11 ? form.cpf : form.rne,
      documentType: user.document?.length === 11 ? "CPF" : "RNE",
      passaport: form.passaport ? form.passaport.toUpperCase() : null,
      avatar: user?.avatar || null,
    };

    try {
      await dispatch(
        updateUserById({ id: user.id, userData: payload })
      ).unwrap();
      await dispatch(fetchCurrentUser());
      setOpenSuccessModal(true);
      setIsEditing(false);
      if (form.passaport) {
        setHasSuccessfulUpdate(true);
      }
    } catch (err) {
      setFormError(err.message || "Erro ao atualizar perfil");
    }
  };

  useEffect(() => {
    if (openSuccessModal) {
      const timer = setTimeout(() => {
        setOpenSuccessModal(false);
        setFormError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSuccessModal]);

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    setFormError(null);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="container-profile">
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "var(--orange-avanade)", fontWeight: "bold" }}
        >
          Meu perfil
        </Typography>
        <Box
          sx={{
            padding: 2,
            textAlign: "center",
            position: "relative",
          }}
        >
          <Avatar
            src={user?.avatar || ""}
            alt="Foto de perfil"
            sx={{
              width: 120,
              height: 120,
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 2,
              borderRadius: "0",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant="h6" className="subtitle-edit">
            Dados Pessoais
          </Typography>
          <IconButton
            onClick={toggleEdit}
            sx={{ color: "var(--orange-avanade)" }}
          >
            {isEditing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <CustomTextfield
            label="Nome"
            name="firstName"
            value={form.firstName}
            onChange={onChangeForm}
            required
            disabled={!isEditing}
          />
          <CustomTextfield
            label="Sobrenome"
            name="lastName"
            value={form.lastName}
            onChange={onChangeForm}
            required
            disabled={!isEditing}
          />
          <CustomTextfield
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={onChangeForm}
            required
            disabled={!isEditing}
          />
          {user && user.document?.length === 11 ? (
            <CustomNumericField
              label="CPF"
              name="cpf"
              value={form.cpf}
              onChange={onChangeForm}
              required
              disabled={true}
              mask="000.000.000-00"
            />
          ) : user ? (
            <CustomTextfield
              label="RNE"
              name="rne"
              value={form.rne}
              onChange={onChangeForm}
              required
              disabled
            />
          ) : null}
          <CustomTextfield_Disable_NOTRequired
            label={hasSuccessfulUpdate ? "Passaporte" : "Passaporte (opcional)"}
            name="passaport"
            value={form.passaport}
            onChange={onChangeForm}
            disabled={!isEditing || hasSuccessfulUpdate}
          />

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "var(--orange-avanade)",
                color: "white",
                textTransform: "none",
                "&:disabled": {
                  backgroundColor: "var(--icons-login-hover)",
                  color: "var(--icons-login-color)",
                },
              }}
              disabled={loading || !isEditing}
            >
              Atualizar
            </Button>
            <Button
              onClick={() => {
                setForm({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  email: user.email || "",
                  cpf: user.document?.length === 11 ? user.document : "",
                  rne: user.document?.length !== 11 ? user.document : "",
                  passaport: user.passaport || "",
                });
                setIsEditing(false);
              }}
              variant="outlined"
              sx={{
                borderColor: "var(--orange-avanade)",
                color: "var(--orange-avanade)",
                textTransform: "none",
                "&:disabled": {
                  borderColor: "var(--icons-login-color)",
                  color: "var(--icons-login-color)",
                },
              }}
              disabled={!isEditing}
            >
              Resetar
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!formError}
        autoHideDuration={6000}
        onClose={() => setFormError(null)}
      >
        <Alert severity="error" onClose={() => setFormError(null)}>
          {formError}
        </Alert>
      </Snackbar>
      <Dialog
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">Sucesso</DialogTitle>
        <DialogContent>
          <DialogContentText>Perfil atualizado com sucesso!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSuccessModal}
            variant="contained"
            sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
