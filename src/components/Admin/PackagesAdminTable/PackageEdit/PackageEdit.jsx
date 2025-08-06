import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
  IconButton,
  Card,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomTextfield } from "../../../CustomInputs/CustomTextfield";
import { CustomTextfield_Disable_NOTRequired } from "../../../CustomInputs/CustomTextfield_Disable_NOTRequired";
import { CustomCheckbox } from "../../../CustomInputs/CustomCheckbox";
import { CustomNumericField } from "../../../CustomInputs/CustomNumericField";
import { CustomPriceField } from "../../../CustomInputs/CustomPriceField";
import { useForm } from "../../../../hooks/useForm";
import { CustomDateField } from "../../../CustomInputs/CustomDateField";
import { CustomSelect } from "../../../CustomInputs/CustomSelect";
import { fetchAddressByZipCode } from "../../../../services/addressService";
import useIsMobile from "../../../../hooks/useIsMobile";
import { IoSearch } from "react-icons/io5";
import {
  updateTravelPackageById,
  fetchTravelPackages,
} from "../../../../store/actions/travelPackagesActions";

export const PackageEdit = ({
  packages,
  fetchTravelPackageById,
  deleteTravelPackageById,
  clearPackageDetails,
  selectedPackageId,
}) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { searchId: urlSearchId = "" } = useParams();
  const {
    loading,
    error: reduxError,
    packageDetails,
  } = useSelector((state) => state.travelPackages);
  const [formError, setFormError] = useState(null);
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchId, setSearchId] = useState(urlSearchId || "");
  const [isFetching, setIsFetching] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const initialState = {
    title: "",
    description: "",
    price: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberGuests: "",
    accommodationDetails: {
      numberBaths: "",
      numberBeds: "",
      hasWifi: false,
      hasParking: false,
      hasPool: false,
      hasGym: false,
      hasRestaurant: false,
      hasPetFriendly: false,
      hasAirConditioning: false,
      hasBreakfastIncluded: false,
      address: {
        addressLine1: "",
        addressLine2: "",
        zipCode: "",
        country: "",
        state: "",
        city: "",
        neighborhood: "",
        latitude: "",
        longitude: "",
      },
    },
    isActive: false,
    isPromo: false,
    discountPercentage: "",
    promotionStartDate: "",
    promotionEndDate: "",
    packageType: "0",
  };

  const { form, setForm, onChangeForm, onChangeNestedForm, resetForm } =
    useForm(initialState);

  // Memorize packages and packageDetails
  const stablePackages = useMemo(() => packages || [], [packages]);
  const stablePackageDetails = useMemo(
    () => packageDetails || null,
    [packageDetails]
  );

  // Define handleSearchPackage
  const handleSearchPackage = useCallback(
    (id) => {
      if (isFetching) {
        console.log("Fetch already in progress, skipping...");
        return;
      }
      if (!id || isNaN(id) || id === "") {
        console.log("Skipping handleSearchPackage: invalid or missing id", id);
        setFormError("ID do pacote inválido ou não fornecido");
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      const packageId = Number(id);
      console.log("handleSearchPackage called with id:", packageId);

      let packageData =
        stablePackages.find((pkg) => pkg.id === packageId) ||
        stablePackageDetails;
      const pkg = Array.isArray(packageData) ? packageData[0] : packageData;

      const getPackageType = (type) => {
        if (type === "Nacional") return "0";
        if (type === "Internacional") return "1";
        return type?.toString() || "0";
      };

      const updateForm = (data) => {
        if (!data) {
          console.log("No data provided to updateForm, resetting form");
          resetForm();
          setFormError("Pacote não encontrado");
          return;
        }

        console.log("Updating form with data:", data);
        const formData = {
          title: data.title || "",
          description: data.description || "",
          price: data.price
            ? (data.price / 100).toFixed(2).replace(".", ",")
            : "",
          destination: data.destination || "",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",
          numberGuests: data.numberGuests?.toString() || "",
          accommodationDetails: {
            numberBaths:
              data.accommodationDetails?.numberBaths?.toString() || "",
            numberBeds: data.accommodationDetails?.numberBeds?.toString() || "",
            hasWifi: data.accommodationDetails?.hasWifi || false,
            hasParking: data.accommodationDetails?.hasParking || false,
            hasPool: data.accommodationDetails?.hasPool || false,
            hasGym: data.accommodationDetails?.hasGym || false,
            hasRestaurant: data.accommodationDetails?.hasRestaurant || false,
            hasPetFriendly: data.accommodationDetails?.hasPetFriendly || false,
            hasAirConditioning:
              data.accommodationDetails?.hasAirConditioning || false,
            hasBreakfastIncluded:
              data.accommodationDetails?.hasBreakfastIncluded || false,
            address: {
              addressLine1:
                data.accommodationDetails?.address?.addressLine1 || "",
              addressLine2:
                data.accommodationDetails?.address?.addressLine2 || "",
              zipCode: data.accommodationDetails?.address?.zipCode || "",
              country: data.accommodationDetails?.address?.country || "",
              state: data.accommodationDetails?.address?.state || "",
              city: data.accommodationDetails?.address?.city || "",
              neighborhood:
                data.accommodationDetails?.address?.neighborhood || "",
              latitude:
                data.accommodationDetails?.address?.latitude?.toString() || "",
              longitude:
                data.accommodationDetails?.address?.longitude?.toString() || "",
            },
          },
          isActive: data.isActive || false,
          isPromo: data.isCurrentlyOnPromotion || false,
          discountPercentage: data.discountPercentage
            ? (data.discountPercentage * 100).toString()
            : "",
          promotionStartDate: data.promotionStartDate
            ? new Date(data.promotionStartDate).toISOString().split("T")[0]
            : "",
          promotionEndDate: data.promotionEndDate
            ? new Date(data.promotionEndDate).toISOString().split("T")[0]
            : "",
          packageType: getPackageType(data.packageType),
        };
        setForm(formData);
        console.log("Form updated with data:", formData);
      };

      if (pkg && pkg.id === packageId) {
        console.log("Using package data for id:", packageId);
        updateForm(pkg);
        setIsFetching(false);
        setHasInitialized(true);
      } else {
        console.log(
          `No package found for id: ${packageId}, fetching from API...`
        );
        dispatch(fetchTravelPackageById(packageId))
          .then((result) => {
            console.log("Fetch result:", result);
            if (!result.payload) {
              console.log("Fetch failed, resetting form");
              resetForm();
              setFormError("Pacote não encontrado");
              return;
            }

            const fetchedPkg = Array.isArray(result.payload)
              ? result.payload[0]
              : result.payload;
            console.log("Fetched pkg:", fetchedPkg);

            if (fetchedPkg && fetchedPkg.id === packageId) {
              console.log("Updating form with fetched package:", fetchedPkg);
              updateForm(fetchedPkg);
            } else {
              console.log(
                "Fetched package does not match id:",
                packageId,
                fetchedPkg
              );
              resetForm();
              setFormError("Pacote fetched não corresponde ao ID solicitado");
            }
          })
          .catch((error) => {
            console.error("API fetch error:", error);
            resetForm();
            setFormError(
              "Erro ao buscar pacote: " + (error.message || "Falha na API")
            );
          })
          .finally(() => {
            setIsFetching(false);
            setHasInitialized(true);
          });
      }
    },
    [
      stablePackages,
      stablePackageDetails,
      dispatch,
      fetchTravelPackageById,
      setForm,
      resetForm,
      isFetching,
    ]
  );

  // Consolidated useEffect with enhanced logging
  useEffect(() => {
    console.log("useEffect running with dependencies:", {
      selectedPackageId,
      urlSearchId,
      hasInitialized,
    });
    const id = selectedPackageId || urlSearchId;
    if (id && !isNaN(id) && id !== "" && !hasInitialized) {
      console.log("useEffect triggered with id:", id);
      handleSearchPackage(id);
    } else if (!hasInitialized) {
      console.log("useEffect skipped: invalid or missing id", {
        selectedPackageId,
        urlSearchId,
        id,
      });
      resetForm();
      setFormError("Nenhum ID de pacote válido fornecido");
      setHasInitialized(true);
    }
  }, [selectedPackageId, urlSearchId, handleSearchPackage, hasInitialized]);

  // Reset hasInitialized when searchId changes
  useEffect(() => {
    setHasInitialized(false);
    setSearchId(urlSearchId || "");
  }, [urlSearchId]);

  // Handle success modal timeout
  useEffect(() => {
    if (openSuccessModal) {
      const timer = setTimeout(() => {
        setOpenSuccessModal(false);
        setFormError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSuccessModal]);

  const isInternational = useMemo(
    () => parseInt(form.packageType, 10) === 1,
    [form.packageType]
  );

  const handleZipCodeChange = async (e) => {
    const { value } = e.target;
    onChangeNestedForm(e);
    setFormError(null);

    if (isInternational) {
      setForm((prev) => ({
        ...prev,
        accommodationDetails: {
          ...prev.accommodationDetails,
          address: {
            ...prev.accommodationDetails.address,
            zipCode: value,
          },
        },
      }));
    } else {
      setIsLoadingZipCode(true);
      try {
        const addressData = await fetchAddressByZipCode(value);
        setForm((prev) => ({
          ...prev,
          accommodationDetails: {
            ...prev.accommodationDetails,
            address: {
              ...prev.accommodationDetails.address,
              ...addressData,
            },
          },
        }));
      } catch (err) {
        setFormError(
          "Não foi possível consultar o CEP, verifique o valor informado",
          err
        );
      } finally {
        setIsLoadingZipCode(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const packageId = selectedPackageId || searchId;
    if (!packageId || isNaN(packageId) || packageId === "") {
      console.error("Invalid package ID:", { selectedPackageId, searchId });
      setFormError("ID do pacote não fornecido ou inválido. Tente novamente.");
      return;
    }

    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.destination ||
      !form.startDate ||
      !form.endDate ||
      !form.numberGuests
    ) {
      setFormError("Campos gerais obrigatórios do formulário");
      return;
    }
    if (
      !form.accommodationDetails.numberBaths ||
      !form.accommodationDetails.numberBeds ||
      !form.accommodationDetails.address.addressLine1 ||
      !form.accommodationDetails.address.zipCode ||
      !form.accommodationDetails.address.country ||
      !form.accommodationDetails.address.state ||
      !form.accommodationDetails.address.city ||
      !form.accommodationDetails.address.neighborhood
    ) {
      setFormError(
        "Campos de acomodação e endereço obrigatórios não preenchidos"
      );
      return;
    }
    if (
      form.packageType === "INTERNATIONAL" &&
      (!form.accommodationDetails.address.latitude ||
        !form.accommodationDetails.address.longitude)
    ) {
      setFormError(
        "Latitude e longitude são obrigatórios para pacotes internacionais"
      );
      return;
    }
    if (
      (form.accommodationDetails.address.latitude &&
        isNaN(parseFloat(form.accommodationDetails.address.latitude))) ||
      (form.accommodationDetails.address.longitude &&
        isNaN(parseFloat(form.accommodationDetails.address.longitude)))
    ) {
      setFormError("Latitude e longitude devem ser valores numéricos válidos");
      return;
    }
    if (
      form.isPromo &&
      (!form.discountPercentage ||
        !form.promotionStartDate ||
        !form.promotionEndDate)
    ) {
      setFormError("Campos de promoção obrigatórios não preenchidos");
      return;
    }

    const cleanedPrice = form.price.replace(/[^0-9,.]/g, "").replace(",", ".");
    if (isNaN(parseFloat(cleanedPrice))) {
      setFormError("Preço inválido");
      return;
    }

    if (
      form.packageType === "INTERNATIONAL" &&
      form.accommodationDetails.address.zipCode.length < 3
    ) {
      setFormError("CEP internacional muito curto");
      return;
    }

    const packageData = {
      title: form.title,
      description: form.description,
      price: Math.floor(parseFloat(cleanedPrice) * 100),
      destination: form.destination,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      numberGuests: parseInt(form.numberGuests, 10),
      accommodationDetails: {
        id: form.accommodationDetails.id || 0, // Use fetched ID or 0
        numberBaths: parseInt(form.accommodationDetails.numberBaths, 10),
        numberBeds: parseInt(form.accommodationDetails.numberBeds, 10),
        hasWifi: form.accommodationDetails.hasWifi,
        hasParking: form.accommodationDetails.hasParking,
        hasPool: form.accommodationDetails.hasPool,
        hasGym: form.accommodationDetails.hasGym,
        hasRestaurant: form.accommodationDetails.hasRestaurant,
        hasPetFriendly: form.accommodationDetails.hasPetFriendly,
        hasAirConditioning: form.accommodationDetails.hasAirConditioning,
        hasBreakfastIncluded: form.accommodationDetails.hasBreakfastIncluded,
        address: {
          id: form.accommodationDetails.address.id || 0, // Use fetched ID or 0
          addressLine1: form.accommodationDetails.address.addressLine1,
          addressLine2: form.accommodationDetails.address.addressLine2 || null,
          zipCode: form.accommodationDetails.address.zipCode,
          country: form.accommodationDetails.address.country,
          state: form.accommodationDetails.address.state,
          city: form.accommodationDetails.address.city,
          neighborhood: form.accommodationDetails.address.neighborhood,
          latitude: form.accommodationDetails.address.latitude
            ? parseFloat(form.accommodationDetails.address.latitude)
            : null,
          longitude: form.accommodationDetails.address.longitude
            ? parseFloat(form.accommodationDetails.address.longitude)
            : null,
        },
      },
      isActive: form.isActive,
      isCurrentlyOnPromotion: form.isPromo,
      discountPercentage: form.isPromo
        ? parseFloat(form.discountPercentage) / 100
        : null,
      promotionStartDate: form.isPromo
        ? new Date(form.promotionStartDate).toISOString()
        : null,
      promotionEndDate: form.isPromo
        ? new Date(form.promotionEndDate).toISOString()
        : null,
      packageType: form.packageType,
    };

    try {
      console.log(
        "Sending update with ID:",
        packageId,
        "and payload:",
        JSON.stringify(packageData, null, 2)
      );
      await dispatch(
        updateTravelPackageById({
          id: Number(packageId),
          packageData,
        })
      ).unwrap();

      await dispatch(fetchTravelPackages()).unwrap();

      console.log("Update successful for package ID:", packageId);
      setOpenSuccessModal(true);
      setIsEditing(false);
      setFormError(null);
    } catch (err) {
      console.error("Update failed:", err);
      setFormError(
        err.message?.includes("FOREIGN KEY")
          ? "Erro ao atualizar: Endereço inválido ou não encontrado no banco de dados."
          : reduxError || err.message || "Erro ao atualizar pacote"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTravelPackageById(selectedPackageId)).unwrap();

      dispatch(clearPackageDetails());
      setOpenDeleteConfirmModal(false);
      setOpenSuccessModal(true);
      setFormError("Pacote deletado com sucesso");
      resetForm();
    } catch (err) {
      const apiError =
        err?.response?.data ||
        reduxError ||
        err.message ||
        "Erro ao excluir pacote";
      console.error("Delete failed:", apiError);
      setFormError(apiError);
    }
  };

  const handlePackageTypeChange = (e) => {
    onChangeForm(e);
    setForm((prev) => ({
      ...prev,
      accommodationDetails: {
        ...prev.accommodationDetails,
        address: {
          addressLine1: "",
          addressLine2: "",
          zipCode: "",
          country: "",
          state: "",
          city: "",
          neighborhood: "",
          latitude: "",
          longitude: "",
        },
      },
    }));
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    setFormError(null);
  };

  const handleOpenDeleteConfirmModal = () => {
    setOpenDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setOpenDeleteConfirmModal(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSearch = () => {
    if (searchId && !isNaN(searchId) && searchId !== "") {
      setHasInitialized(false); // Allow new fetch
      handleSearchPackage(searchId);
    } else {
      setFormError("Por favor, insira um ID de pacote válido");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: "1330px", margin: "0 auto"}}>
      <Card
        sx={{
          maxWidth: 360,
          borderRadius: "16px",
          backgroundColor: "var(--footer-bg)",
          color: "var(--text-card-package)",
          boxShadow: "none",
          border: "1px solid var(--no-active-tab)",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          margin: "0 auto",
          mb: 4,
        }}
      >
        <TextField
          label="ID do Pacote"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          size="small"
          variant="outlined"
          sx={{
            flex: 1,
            width: "100%",
            input: {
              color: "var(--text-footer)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--icons-login-color)",
              },
              "&:hover fieldset": {
                borderColor: "var(--orange-avanade)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--orange-avanade)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "var(--icons-login-color)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "var(--orange-avanade)",
            },
          }}
        />

        <Button
          onClick={handleSearch}
          variant="contained"
          startIcon={<IoSearch />}
          sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
        >
          Buscar
        </Button>
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "var(--orange-avanade)" }}>
          Editar Pacote
        </Typography>
        <Box>
          <IconButton
            onClick={toggleEdit}
            sx={{ color: "var(--orange-avanade)" }}
          >
            {isEditing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
          <IconButton
            onClick={handleOpenDeleteConfirmModal}
            sx={{ color: "var(--orange-avanade)" }}
            disabled={!isEditing || !selectedPackageId}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}
      >
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Dados Gerais
        </Typography>
        <CustomTextfield_Disable_NOTRequired
          label="Título *"
          name="title"
          value={form.title}
          onChange={onChangeForm}
          required
          disabled={!isEditing}
        />
        <CustomTextfield_Disable_NOTRequired
          label="Descrição *"
          name="description"
          value={form.description}
          onChange={onChangeForm}
          required
          disabled={!isEditing}
        />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomTextfield_Disable_NOTRequired
            label="Destino *"
            name="destination"
            value={form.destination}
            onChange={onChangeForm}
            required
            disabled={!isEditing}
          />
          <CustomPriceField
            label="Preço *"
            name="price"
            value={form.price}
            onChange={onChangeForm}
            mask={{
              prefix: "R$ ",
              thousandSeparator: ",",
              decimalSeparator: ".",
              decimalScale: 2,
              fixedDecimalScale: true,
            }}
            required
            disabled={!isEditing}
          />
        </Box>

        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomDateField
            label="Data de Início *"
            name="startDate"
            value={form.startDate}
            onChange={onChangeForm}
            max={form.endDate}
            required
            disabled={!isEditing}
          />
          <CustomDateField
            label="Data de Término *"
            name="endDate"
            value={form.endDate}
            onChange={onChangeForm}
            min={form.startDate}
            required
            disabled={!isEditing}
          />
          <CustomNumericField
            label="Nº max de Hóspedes *"
            name="numberGuests"
            value={form.numberGuests}
            onChange={onChangeForm}
            mask="0000"
            required
            disabled={!isEditing}
          />
          <CustomSelect
            label="Tipo de Pacote *"
            name="packageType"
            value={form.packageType}
            onChange={handlePackageTypeChange}
            options={[
              { value: "0", label: "Nacional" },
              { value: "1", label: "Internacional" },
            ]}
            required
            disabled={!isEditing}
          />
        </Box>

        <CustomCheckbox
          label="Está Ativo"
          name="isActive"
          checked={form.isActive}
          onChange={onChangeForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Em Promoção"
          name="isPromo"
          checked={form.isPromo}
          onChange={onChangeForm}
          disabled={!isEditing}
        />

        {form.isPromo && (
          <>
            <Divider
              sx={{
                my: 2,
                borderColor: form.isPromo
                  ? "var(--orange-avanade)"
                  : "var(--no-active-tab)",
              }}
            />
            <Typography variant="subtitle1">Promoção</Typography>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                gap: 2,
                width: "100%",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <CustomNumericField
                label="Percentual de Desconto (%) *"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={onChangeForm}
                mask="00"
                required
                disabled={!isEditing}
              />
              <CustomDateField
                label="Início da Promoção *"
                name="promotionStartDate"
                value={form.promotionStartDate}
                onChange={onChangeForm}
                max={form.promotionEndDate}
                required
                disabled={!isEditing}
              />
              <CustomDateField
                label="Fim da Promoção *"
                name="promotionEndDate"
                value={form.promotionEndDate}
                onChange={onChangeForm}
                min={form.promotionStartDate}
                required
                disabled={!isEditing}
              />
            </Box>
          </>
        )}

        <Divider
          sx={{
            my: 2,
            borderColor: form.isPromo
              ? "var(--orange-avanade)"
              : "var(--no-active-tab)",
          }}
        />
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Detalhes da Acomodação
        </Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomNumericField
            label="Número de Banheiros *"
            name="accommodationDetails.numberBaths"
            value={form.accommodationDetails.numberBaths}
            onChange={onChangeNestedForm}
            mask="00"
            required
            disabled={!isEditing}
          />
          <CustomNumericField
            label="Número de Camas *"
            name="accommodationDetails.numberBeds"
            value={form.accommodationDetails.numberBeds}
            onChange={onChangeNestedForm}
            mask="000"
            required
            disabled={!isEditing}
          />
        </Box>
        <CustomCheckbox
          label="Wi-Fi"
          name="accommodationDetails.hasWifi"
          checked={form.accommodationDetails.hasWifi}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Estacionamento"
          name="accommodationDetails.hasParking"
          checked={form.accommodationDetails.hasParking}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Piscina"
          name="accommodationDetails.hasPool"
          checked={form.accommodationDetails.hasPool}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Academia"
          name="accommodationDetails.hasGym"
          checked={form.accommodationDetails.hasGym}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Restaurante"
          name="accommodationDetails.hasRestaurant"
          checked={form.accommodationDetails.hasRestaurant}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Pet Friendly"
          name="accommodationDetails.hasPetFriendly"
          checked={form.accommodationDetails.hasPetFriendly}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Ar-Condicionado"
          name="accommodationDetails.hasAirConditioning"
          checked={form.accommodationDetails.hasAirConditioning}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />
        <CustomCheckbox
          label="Café da Manhã Incluso"
          name="accommodationDetails.hasBreakfastIncluded"
          checked={form.accommodationDetails.hasBreakfastIncluded}
          onChange={onChangeNestedForm}
          disabled={!isEditing}
        />

        <Divider sx={{ my: 2, borderColor: "var(--no-active-tab)" }} />
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Endereço
        </Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomTextfield_Disable_NOTRequired
            label="Logradouro *"
            name="accommodationDetails.address.addressLine1"
            value={form.accommodationDetails.address.addressLine1}
            onChange={onChangeNestedForm}
            required
            disabled={!isEditing}
          />
          {isInternational ? (
            <CustomTextfield_Disable_NOTRequired
              label="Complemento *"
              name="accommodationDetails.address.addressLine2"
              value={form.accommodationDetails.address.addressLine2}
              onChange={onChangeNestedForm}
              disabled={
                isLoadingZipCode ||
                !form.accommodationDetails.address.country ||
                !isEditing
              }
            />
          ) : (
            <CustomNumericField
              label="Número *"
              name="accommodationDetails.address.addressLine2"
              value={form.accommodationDetails.address.addressLine2}
              onChange={onChangeNestedForm}
              mask="000000"
              disabled={!isEditing}
            />
          )}
          {isInternational ? (
            <CustomTextfield_Disable_NOTRequired
              label="ZIP CODE *"
              name="accommodationDetails.address.zipCode"
              value={form.accommodationDetails.address.zipCode}
              onChange={handleZipCodeChange}
              required
              disabled={
                isLoadingZipCode ||
                !form.accommodationDetails.address.country ||
                !isEditing
              }
            />
          ) : (
            <CustomNumericField
              label="CEP *"
              name="accommodationDetails.address.zipCode"
              value={form.accommodationDetails.address.zipCode}
              onChange={handleZipCodeChange}
              required
              disabled={isLoadingZipCode || !isEditing}
              mask="00000-000"
            />
          )}
        </Box>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomTextfield_Disable_NOTRequired
            label="País *"
            name="accommodationDetails.address.country"
            value={form.accommodationDetails.address.country}
            onChange={onChangeNestedForm}
            required
            disabled={!isEditing}
          />
          <CustomTextfield_Disable_NOTRequired
            label="Estado *"
            name="accommodationDetails.address.state"
            value={form.accommodationDetails.address.state}
            onChange={onChangeNestedForm}
            required
            disabled={!isEditing}
          />
          <CustomTextfield_Disable_NOTRequired
            label="Cidade *"
            name="accommodationDetails.address.city"
            value={form.accommodationDetails.address.city}
            onChange={onChangeNestedForm}
            required
            disabled={!isEditing}
          />
          <CustomTextfield_Disable_NOTRequired
            label="Bairro *"
            name="accommodationDetails.address.neighborhood"
            value={form.accommodationDetails.address.neighborhood}
            onChange={onChangeNestedForm}
            required
            disabled={!isEditing}
          />
        </Box>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomNumericField
            label="Latitude *"
            name="accommodationDetails.address.latitude"
            value={form.accommodationDetails.address.latitude}
            onChange={onChangeNestedForm}
            disabled={!isEditing}
          />
          <CustomNumericField
            label="Longitude *"
            name="accommodationDetails.address.longitude"
            value={form.accommodationDetails.address.longitude}
            onChange={onChangeNestedForm}
            disabled={!isEditing}
          />
        </Box>
        <Divider sx={{ my: 2, borderColor: "var(--no-active-tab)" }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
            disabled={loading || !isEditing}
          >
            Atualizar
          </Button>
          <Button
            onClick={() => {
              resetForm();
              const id = selectedPackageId || searchId;
              if (id && !isNaN(id) && id !== "") {
                handleSearchPackage(id);
              } else {
                setFormError("Nenhum pacote selecionado para resetar");
              }
              dispatch(clearPackageDetails());
              setIsEditing(false);
            }}
            variant="outlined"
            sx={{
              borderColor: "var(--orange-avanade)",
              color: "var(--orange-avanade)",
            }}
            disabled={!isEditing}
          >
            Resetar
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={!!formError}
        autoHideDuration={6000}
        onClose={() => setFormError(null)}
      >
        <Alert severity="error" onClose={() => setFormError(null)}>
          {typeof formError === "string" && formError}
          {formError && typeof formError === "object" && (
            <>
              <strong>{formError.title || "Erro ao atualizar o pacote"}</strong>
              <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                {formError.errors &&
                  Object.entries(formError.errors).map(([field, messages]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {messages.join(", ")}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </Alert>
      </Snackbar>
      <Dialog
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">Sucesso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {formError === "Pacote deletado com sucesso"
              ? "Pacote deletado com sucesso!"
              : "Pacote atualizado com sucesso!"}
          </DialogContentText>
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
      <Dialog
        open={openDeleteConfirmModal}
        onClose={handleCloseDeleteConfirmModal}
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
            onClick={handleCloseDeleteConfirmModal}
            variant="outlined"
            sx={{
              borderColor: "var(--orange-avanade)",
              color: "var(--orange-avanade)",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackageEdit;
