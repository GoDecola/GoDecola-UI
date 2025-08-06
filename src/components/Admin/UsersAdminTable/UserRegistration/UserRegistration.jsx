import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { CustomTextfield } from "../../../CustomInputs/CustomTextfield";
import { CustomSelect } from "../../../CustomInputs/CustomSelect";
import { CustomNumericField } from "../../../CustomInputs/CustomNumericField";
import { useForm } from "../../../../hooks/useForm";
import { createUser } from "../../../../store/actions/userActions";
import useIsMobile from "../../../../hooks/useIsMobile";

export const UserRegistration = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { loading, error: reduxError } = useSelector((state) => state.user);
  const [formError, setFormError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    document: "",
    documentType: "cpf",
    role: "USER",
  };

  const { form, setForm, onChangeForm, resetForm } = useForm(initialState);

  const handleDocumentTypeChange = (e) => {
    onChangeForm(e);
    setForm((prev) => ({
      ...prev,
      document: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.document ||
      !form.role
    ) {
      setFormError("Todos os campos são obrigatórios");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setFormError("Por favor, insira um email válido.");
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    const hasUpperCase = /[A-Z]/.test(form.password);
    if (!hasUpperCase) {
      setFormError("A senha deve conter pelo menos uma letra maiúscula.");
      return;
    }
    const hasNumber = /\d/.test(form.password);
    if (!hasNumber) {
      setFormError("A senha deve conter pelo menos um número.");
      return;
    }
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
    if (!hasSpecialChar) {
      setFormError(
        'A senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>).'
      );
      return;
    }

    // Document validation
    const cleanedDocument = form.document.replace(/[^A-Za-z0-9]/g, "");
    if (!form.document) {
      setFormError("Por favor, preencha o CPF ou RNE.");
      return;
    }
    if (form.documentType === "cpf" && cleanedDocument.length !== 11) {
      setFormError("CPF deve ter 11 dígitos.");
      return;
    }
    if (
      form.documentType === "rne" &&
      !/^[A-Za-z0-9]{8,12}$/.test(cleanedDocument)
    ) {
      setFormError(
        "RNE inválido. Deve ter entre 8 e 12 caracteres alfanuméricos."
      );
      return;
    }

    // Format payload
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      document: cleanedDocument,
      role: form.role,
    };

    try {
      await dispatch(createUser(payload)).unwrap();
      resetForm();
      setFormError("Usuário cadastrado com sucesso");
      setOpenSuccessModal(true);
    } catch (err) {
      setFormError(reduxError || err.message || "Erro ao cadastrar usuário");
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    setFormError(null);
  };

  return (
    <Box sx={{ p: 2, maxWidth: "1330px", margin: "0 auto" }}>
      <Typography variant="h6" color="var(--orange-avanade)">
        Cadastro de Usuário
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}
      >
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Dados do Usuário
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomTextfield
            label="Nome *"
            name="firstName"
            value={form.firstName}
            onChange={onChangeForm}
            required
          />
          <CustomTextfield
            label="Sobrenome *"
            name="lastName"
            value={form.lastName}
            onChange={onChangeForm}
            required
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomTextfield
            label="Email *"
            name="email"
            value={form.email}
            onChange={onChangeForm}
            required
          />
          <CustomTextfield
            label="Senha *"
            name="password"
            type="password"
            value={form.password}
            onChange={onChangeForm}
            required
          />
        </Box>
        <Divider sx={{ my: 2, borderColor: "var(--no-active-tab)" }} />
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Documento *
        </Typography>
        <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
          <RadioGroup
            row
            name="documentType"
            value={form.documentType}
            onChange={handleDocumentTypeChange}
          >
            <FormControlLabel
              value="cpf"
              control={
                <Radio
                  sx={{
                    color: "var(--orange-avanade)",
                    "&.Mui-checked": { color: "var(--orange-avanade)" },
                  }}
                />
              }
              label="CPF"
              sx={{
                color: "var(--text-footer)",
              }}
            />
            <FormControlLabel
              value="rne"
              control={
                <Radio
                  sx={{
                    color: "var(--orange-avanade)",
                    "&.Mui-checked": { color: "var(--orange-avanade)" },
                  }}
                />
              }
              label="RNE"
              sx={{
                color: "var(--text-footer)",
              }}
            />
          </RadioGroup>
        </FormControl>
        <CustomNumericField
          label={form.documentType === "cpf" ? "CPF *" : "RNE *"}
          name="document"
          value={form.document}
          onChange={onChangeForm}
          mask={form.documentType === "cpf" ? "000.000.000-00" : "AAAAAAAAAAAA"}
          required
        />
        <Divider sx={{ my: 2, borderColor: "var(--no-active-tab)" }} />
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Perfil *
        </Typography>
        <CustomSelect
          label="Perfil *"
          name="role"
          value={form.role}
          onChange={onChangeForm}
          options={[
            { value: "ADMIN", label: "Administrador" },
            { value: "SUPPORT", label: "Suporte" },
            { value: "USER", label: "Cliente" },
          ]}
          required
        />
        <Divider sx={{ my: 2, borderColor: "var(--no-active-tab)" }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
            disabled={loading}
          >
            Cadastrar
          </Button>
          <Button
            onClick={() => resetForm()}
            variant="outlined"
            sx={{
              borderColor: "var(--orange-avanade)",
              color: "var(--orange-avanade)",
            }}
          >
            Resetar
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={!!formError && !formError.includes("sucesso")}
        autoHideDuration={6000}
        onClose={() => setFormError(null)}
      >
        <Alert severity="error" onClose={() => setFormError(null)}>
          {formError || reduxError}
        </Alert>
      </Snackbar>
      <Dialog
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">Sucesso</DialogTitle>
        <DialogContent>
          <DialogContentText>Usuário cadastrado com sucesso!</DialogContentText>
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
    </Box>
  );
};

export default UserRegistration;
