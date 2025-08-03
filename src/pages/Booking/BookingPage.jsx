import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { CustomTextfield } from "../../components/CustomInputs/CustomTextfield";
import { CustomDateField } from "../../components/CustomInputs/CustomDateField";
import { CustomNumericField } from "../../components/CustomInputs/CustomNumericField";
import { useForm } from "../../hooks/useForm";
import { createBooking } from "../../store/actions/bookingActions";
import useIsMobile from "../../hooks/useIsMobile";
import { PackageCard } from "../../components/PackageCard/PackageCard";
import {
  goToCheckout,
  goToPackageDetails,
  goToHome,
} from "../../routes/coordinator";
import { formatCpf } from "../../utils/formatCpf";
import { formatDate } from "../../utils/formatDate";

const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { packageData } = location.state || {};
  const { loading, error: reduxError } = useSelector((state) => state.bookings);
  const user = useSelector((state) => state.user.user);
  const [formError, setFormError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [includeUser, setIncludeUser] = useState(true);

  const isValidCpf = (document) => {
    return document && /^\d{11}$/.test(document);
  };

  const initialState = {
    checkInDate: "",
    checkOutDate: "",
    guests: includeUser
      ? [
          {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            documentType: isValidCpf(user?.document) ? "cpf" : "rne",
            cpf: isValidCpf(user?.document) ? formatCpf(user.document) : "",
            rne: !isValidCpf(user?.document) ? user?.document || "" : "",
            dateOfBirth: "",
          },
        ]
      : [],
  };

  const { form, setForm, onChangeForm } = useForm(initialState);
  const maxGuests = packageData?.numberGuests || 1;
  const canAddGuest = form.guests.length < maxGuests;
  const endDateFormatted = packageData?.endDate
    ? new Date(packageData.endDate).toISOString().split("T")[0]
    : null;
  const maxDateOfBirth = new Date();
  maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 18);
  const maxDateOfBirthFormatted = maxDateOfBirth.toISOString().split("T")[0];
  const calculateDiscountedPrice = (price, discountPercentage) =>
    price * (1 - discountPercentage);

  useEffect(() => {
    if (!packageData || !packageData.id) {
      setFormError("Nenhum pacote selecionado");
      goToHome(navigate);
    }
  }, [packageData, navigate]);

  useEffect(() => {
    if (openSuccessModal) {
      const timer = setTimeout(() => {
        setOpenSuccessModal(false);
        setFormError(null);
        goToCheckout(navigate);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSuccessModal, navigate]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      guests: includeUser
        ? [
            {
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
              documentType: isValidCpf(user?.document) ? "cpf" : "rne",
              cpf: isValidCpf(user?.document) ? formatCpf(user.document) : "",
              rne: !isValidCpf(user?.document) ? user?.document || "" : "",
              dateOfBirth: prev.guests[0]?.dateOfBirth || "",
            },
            ...prev.guests.slice(1),
          ]
        : prev.guests.slice(1),
    }));
  }, [includeUser, user, setForm]);

  const handleAddGuest = () => {
    if (canAddGuest) {
      setForm((prev) => ({
        ...prev,
        guests: [
          ...prev.guests,
          {
            firstName: "",
            lastName: "",
            email: "",
            documentType: "cpf",
            cpf: "",
            rne: "",
            dateOfBirth: "",
          },
        ],
      }));
    }
  };

  const handleRemoveGuest = (index) => {
    if (index === 0 && includeUser) return;
    setForm((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
  };

  const handleGuestChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      guests: prev.guests.map((guest, i) =>
        i === index
          ? {
              ...guest,
              [name]: value,
              ...(name === "documentType" && value === "cpf"
                ? { rne: "" }
                : {}),
              ...(name === "documentType" && value === "rne"
                ? { cpf: "" }
                : {}),
            }
          : guest
      ),
    }));
  };

  const handleIncludeUserChange = (e) => {
    setIncludeUser(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!user?.id) {
      setFormError("Usuário não autenticado");
      return;
    }
    if (!packageData?.id) {
      setFormError("Pacote inválido");
      return;
    }
    if (!form.checkInDate || !form.checkOutDate) {
      setFormError("Datas de check-in e check-out são obrigatórias");
      return;
    }
    if (new Date(form.checkInDate) >= new Date(form.checkOutDate)) {
      setFormError("Data de check-in deve ser anterior à data de check-out");
      return;
    }
    if (
      packageData.endDate &&
      new Date(form.checkOutDate) > new Date(packageData.endDate)
    ) {
      setFormError(
        "Data de check-out não pode ser posterior à data final do pacote"
      );
      return;
    }
    if (form.guests.length === 0) {
      setFormError("Pelo menos um hóspede deve ser informado");
      return;
    }
    for (let i = 0; i < form.guests.length; i++) {
      const guest = form.guests[i];
      if (
        !guest.firstName ||
        !guest.lastName ||
        !guest.email ||
        !guest.dateOfBirth
      ) {
        setFormError(`Campos obrigatórios do hóspede ${i + 1} não preenchidos`);
        return;
      }
      if (!guest.cpf && !guest.rne) {
        setFormError(`Hóspede ${i + 1} deve ter CPF ou RNE informado`);
        return;
      }
      if (guest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
        setFormError(`Email inválido para o hóspede ${i + 1}`);
        return;
      }
      if (
        guest.documentType === "cpf" &&
        guest.cpf &&
        !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(guest.cpf)
      ) {
        setFormError(`CPF inválido para o hóspede ${i + 1}`);
        return;
      }
      if (
        guest.documentType === "rne" &&
        guest.rne &&
        !/^[A-Za-z0-9]{8,12}$/.test(guest.rne)
      ) {
        setFormError(`RNE inválido para o hóspede ${i + 1}`);
        return;
      }
      if (i === 0) {
        const dob = new Date(guest.dateOfBirth);
        const ageDiffMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age < 18) {
          setFormError("O primeiro hóspede deve ter pelo menos 18 anos");
          return;
        }
      }
    }

    const payload = {
      userId: user.id,
      travelPackageId: packageData.id,
      checkInDate: new Date(form.checkInDate).toISOString(),
      checkOutDate: new Date(form.checkOutDate).toISOString(),
      reservationDate: new Date().toISOString(),
      guests: form.guests.map((guest) => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        cpf: guest.documentType === "cpf" ? guest.cpf : null,
        rne: guest.documentType === "rne" ? guest.rne : null,
        dateOfBirth: new Date(guest.dateOfBirth).toISOString(),
      })),
    };

    try {
      console.log("Submitting booking:", payload);
      const response = await dispatch(createBooking(payload)).unwrap();
      console.log("Booking response:", response);
      setFormError("Redirecionando para o pagamento.");
      setOpenSuccessModal(true);
    } catch (err) {
      console.error("Booking error:", err);
      setFormError(reduxError || err.message || "Erro ao criar reserva");
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    setFormError(null);
    goToCheckout(navigate);
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--background-color)",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          minWidth: isMobile ? "90%" : "60%",
          pt: isMobile ? 2 : 4,
          pb: isMobile ? 10 : 18,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="var(--primary-text-color)">
            Criar Reserva
          </Typography>
          <Button
            onClick={() => goToPackageDetails(navigate, packageData.id)}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "var(--orange-avanade)",
              color: "var(--orange-avanade)",
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
                md: "1rem",
              },
              padding: {
                xs: "6px 12px",
                sm: "8px 16px",
              },
            }}
          >
            Cancelar
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            my: 2,
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          {packageData ? (
            <PackageCard
              id={packageData.id}
              title={packageData.title}
              price={packageData.price}
              averageRating={packageData.averageRating}
              imageSrc={packageData.mediasUrl}
              sx={{
                flex: isMobile ? "1" : "0 0 50%",
                maxWidth: isMobile ? "100%" : "50%",
              }}
            />
          ) : (
            <Typography>Nenhum pacote selecionado</Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: isMobile ? "1" : "0 0 50%",
              width: isMobile ? "100%" : "50%",
            }}
          >
            <Typography variant="subtitle1" color="var(--primary-text-color)">
              Detalhes da Reserva
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "300px",
                flexDirection: "column",
              }}
            >
              <CustomDateField
                label="Data de Check-in"
                name="checkInDate"
                value={form.checkInDate}
                onChange={onChangeForm}
                min={
                  packageData?.startDate ||
                  new Date().toISOString().split("T")[0]
                }
                max={form.checkOutDate || endDateFormatted}
                required
                sx={{ flex: 1 }}
              />
              <CustomDateField
                label="Data de Check-out"
                name="checkOutDate"
                value={form.checkOutDate}
                onChange={onChangeForm}
                min={form.checkInDate}
                max={endDateFormatted}
                required
                sx={{ flex: 1 }}
              />
            </Box>
            <Typography variant="body2" color="var(--primary-text-color)">
              Período do Pacote: Início: {formatDate(packageData?.startDate)} -
              Fim: {formatDate(packageData?.endDate)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "var(--orange-avanade)" }} />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeUser}
              onChange={handleIncludeUserChange}
              sx={{
                color: "var(--text-footer)",
                "&.Mui-checked": {
                  color: "var(--orange-avanade)",
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            />
          }
          label="Incluir meus dados como hóspede"
          sx={{
            "& .MuiFormControlLabel-label": {
              color: includeUser
                ? "var(--orange-avanade)"
                : "var(--text-footer)",
            },
          }}
        />
        <Typography variant="subtitle1" color="var(--primary-text-color)">
          Hóspedes
        </Typography>
        {form.guests.length === 0 && !includeUser && (
          <Typography color="error">
            Pelo menos um hóspede deve ser informado
          </Typography>
        )}
        {form.guests.map((guest, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid var(--orange-avanade)",
              borderRadius: "4px",
              p: 2,
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" color="var(--primary-text-color)">
              Hóspede {index + 1} {index === 0 && includeUser ? "(Você)" : ""}
            </Typography>
            {index === 0 && includeUser ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 0 : 4,
                  justifyContent: "flex-start",
                }}
              >
                <Box>
                  <Typography variant="body2" color="var(--primary-text-color)">
                    Nome:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="var(--primary-text-color)"
                    sx={{ fontSize: "1.2rem", marginTop: "-15px" }}
                  >
                    {guest.firstName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="var(--primary-text-color)">
                    Sobrenome:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="var(--primary-text-color)"
                    sx={{ fontSize: "1.2rem", marginTop: "-15px" }}
                  >
                    {guest.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="var(--primary-text-color)">
                    Email:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="var(--primary-text-color)"
                    sx={{ fontSize: "1.2rem", marginTop: "-15px" }}
                  >
                    {guest.email}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <CustomTextfield
                  label="Nome"
                  name="firstName"
                  value={guest.firstName}
                  onChange={(e) => handleGuestChange(e, index)}
                  required
                />
                <CustomTextfield
                  label="Sobrenome"
                  name="lastName"
                  value={guest.lastName}
                  onChange={(e) => handleGuestChange(e, index)}
                  required
                />
                <CustomTextfield
                  label="Email"
                  name="email"
                  value={guest.email}
                  onChange={(e) => handleGuestChange(e, index)}
                  required
                />
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center",
              }}
            >
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ color: "var(--primary-text-color)", fontSize: "13px" }}
                >
                  Tipo de Documento:
                </FormLabel>
                {index === 0 && includeUser ? (
                  <Typography
                    variant="body2"
                    color="var(--primary-text-color)"
                    style={{ width: "300px", fontSize: "1.1rem" }}
                  >
                    {user?.document
                      ? isValidCpf(user.document)
                        ? `CPF: ${formatCpf(user.document)}`
                        : `RNE: ${user.document}`
                      : "Documento não informado"}
                  </Typography>
                ) : (
                  <>
                    <RadioGroup
                      row
                      name="documentType"
                      value={guest.documentType}
                      onChange={(e) => handleGuestChange(e, index)}
                      sx={{ width: "300px" }}
                    >
                      <FormControlLabel
                        value="cpf"
                        control={
                          <Radio
                            sx={{
                              color: "var(--orange-avanade)",
                              "&.Mui-checked": {
                                color: "var(--orange-avanade)",
                              },
                            }}
                          />
                        }
                        label="CPF"
                      />
                      <FormControlLabel
                        value="rne"
                        control={
                          <Radio
                            sx={{
                              color: "var(--orange-avanade)",
                              "&.Mui-checked": {
                                color: "var(--orange-avanade)",
                              },
                            }}
                          />
                        }
                        label="RNE"
                      />
                    </RadioGroup>
                    {guest.documentType === "cpf" ? (
                      <CustomNumericField
                        label="CPF"
                        name="cpf"
                        value={guest.cpf}
                        onChange={(e) => handleGuestChange(e, index)}
                        mask="000.000.000-00"
                        required
                      />
                    ) : (
                      <CustomTextfield
                        label="RNE"
                        name="rne"
                        value={guest.rne}
                        onChange={(e) => handleGuestChange(e, index)}
                        required
                      />
                    )}
                  </>
                )}
              </FormControl>
              <div style={{ width: "300px" }}>
                <CustomDateField
                  label="Data de Nascimento"
                  name="dateOfBirth"
                  value={guest.dateOfBirth}
                  onChange={(e) => handleGuestChange(e, index)}
                  max={
                    index === 0
                      ? maxDateOfBirthFormatted
                      : new Date().toISOString().split("T")[0]
                  }
                  required
                />
              </div>
            </Box>
            {!(index === 0 && includeUser) && (
              <Button
                onClick={() => handleRemoveGuest(index)}
                variant="outlined"
                sx={{
                  mt: 2,
                  borderColor: "var(--orange-avanade)",
                  color: "var(--orange-avanade)",
                }}
                startIcon={<Remove />}
              >
                Remover Hóspede
              </Button>
            )}
          </Box>
        ))}
        <Button
          onClick={handleAddGuest}
          variant="contained"
          sx={{
            backgroundColor: canAddGuest
              ? "var(--orange-avanade)"
              : "var(--no-active-tab)",
            color: "white",
            width: "fit-content",
          }}
          startIcon={<Add />}
          disabled={!canAddGuest}
        >
          Adicionar Hóspede
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--background-color-invert)",
            transition: "background-color 0.25s ease-in-out",
            px: { xs: 2, sm: 3, md: 5 },
            height: 80,
            position: "fixed",
            width: "100%",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1500,
            color: "var(--secondary-text-color)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {packageData.isCurrentlyOnPromotion ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "var(--secondary-text-color)",
                      fontSize: { xs: "1.0rem", sm: "1.3rem", md: "1.7rem" },
                    }}
                  >
                    R$ {packageData.price}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--orange-avanade)",
                      fontWeight: "bold",
                      fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2.1rem" },
                      ml: -1,
                    }}
                  >
                    R${" "}
                    {calculateDiscountedPrice(
                      packageData.price,
                      packageData.discountPercentage
                    ).toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--secondary-text-color)",
                    fontWeight: "bold",
                    fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2.1rem" },
                  }}
                >
                  R$ {packageData.price}
                </Typography>
              )}
            </Box>
            {packageData.isCurrentlyOnPromotion && (
              <Typography
                variant="body2"
                sx={{
                  color: "var(--secondary-text-color)",
                  mt: { xs: "-21px", md: "0px" },
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
                }}
              >
                Promoção: {formatDate(packageData.promotionStartDate)} à{" "}
                {formatDate(packageData.promotionEndDate)}
              </Typography>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              textTransform: "none",
              color: "white",
              background: "var(--orange-avanade-invert)",
              borderRadius: "15px",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
              fontWeight: "bold",
              py: { xs: 0, sm: 1 },
              px: { xs: 0, sm: 3, md: 4 },
              fontFamily:
                '"Segoe UI", OpenSans, Roboto, Arial, Tahoma, Helvetica, sans-serif',
              "&:hover": {
                background: "var(--orange-avanade)",
              },
            }}
          >
            Confirmar Reserva
          </Button>
        </Box>

        <Snackbar
          open={
            !!formError &&
            !formError.includes("sucesso") &&
            !formError.includes("pagamento")
          }
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
            <DialogContentText>Reserva criada com sucesso!</DialogContentText>
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
    </Box>
  );
};

export default BookingPage;
