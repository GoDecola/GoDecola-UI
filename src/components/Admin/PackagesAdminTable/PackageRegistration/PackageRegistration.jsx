import "./PackageRegistration.css";
import { useState, useMemo, useCallback, useEffect } from "react";
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
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { CustomTextfield } from "../../../CustomInputs/CustomTextfield";
import { CustomCheckbox } from "../../../CustomInputs/CustomCheckbox";
import { CustomNumericField } from "../../../CustomInputs/CustomNumericField";
import { CustomPriceField } from "../../../CustomInputs/CustomPriceField";
import { useForm } from "../../../../hooks/useForm";
import { CustomDateField } from "../../../CustomInputs/CustomDateField";
import { CustomSelect } from "../../../CustomInputs/CustomSelect";
import {
  createTravelPackage,
  uploadTravelPackageMedia,
} from "../../../../store/actions/travelPackagesActions";
import useIsMobile from "../../../../hooks/useIsMobile";
import { fetchAddressByZipCode } from "../../../../services/addressService";
import { useDropzone } from "react-dropzone";
import { fetchTravelPackages } from "../../../../store/actions/travelPackagesActions";
import SearchIcon from "@mui/icons-material/Search";

export const PackageRegistration = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { loading, error: reduxError } = useSelector(
    (state) => state.travelPackages
  );
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState("");
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

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
    packageType: 0,
  };

  const { form, setForm, onChangeForm, onChangeNestedForm, resetForm } =
    useForm(initialState);

  const isInternational = useMemo(
    () => parseInt(form.packageType, 10) === 1,
    [form.packageType]
  );

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    /*     console.log(
      "Accepted files:",
      acceptedFiles.map((file) => file.name)
    );
    acceptedFiles.forEach((f) =>
      console.log(f.name, typeof f, f instanceof File)
    ); */

    setMediaFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({ file })),
    ]);

    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map((rejected) => {
        const fileName = rejected.file.name;
        const reasons = rejected.errors.map((e) => {
          if (e.code === "file-invalid-type") return "tipo não permitido";
          if (e.code === "file-too-large") return "tamanho excedido";
          return e.message;
        });
        return `• ${fileName}: ${reasons.join(", ")}`;
      });

      setFormError(`Arquivos rejeitados:\n${errorMessages.join("\n")}`);
      console.warn("Arquivos rejeitados:", errorMessages);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "image/avif": [".avif"],
      "image/svg+xml": [".svg"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogv"],
    },
    multiple: true,
    maxSize: 100 * 1024 * 1024,
  });

  const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleZipCodeInputChange = (e) => {
    const { value } = e.target;

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
    setFormError(null); // limpa erro ao digitar
  };

  const handleZipCodeSearch = async () => {
    const zipCode = form.accommodationDetails.address.zipCode;

    if (!zipCode || !zipCode.match(/^\d{5}-\d{3}$/)) {
      setFormError("CEP inválido. Use o formato 00000-000.");
      return;
    }

    setIsLoadingZipCode(true);
    setFormError(null);

    try {
      const addressData = await fetchAddressByZipCode(zipCode);
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
        "Não foi possível consultar o CEP, verifique o valor informado"
      );
      console.log("Erro ao consultar CEP:", err.message);
    } finally {
      setIsLoadingZipCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
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
      isInternational &&
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
    if (mediaFiles.length === 0) {
      setFormError("Pelo menos uma mídia deve ser adicionada");
      return;
    }
    if (
      mediaFiles.some((media) => !media.file || !(media.file instanceof File))
    ) {
      setFormError("Alguns arquivos selecionados são inválidos");
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

    // Validate price
    const cleanedPrice = form.price.replace(/[^0-9,.]/g, "").replace(",", ".");
    if (isNaN(parseFloat(cleanedPrice))) {
      setFormError("Preço inválido");
      return;
    }

    // Validate ZIP code
    if (
      isInternational &&
      form.accommodationDetails.address.zipCode.length < 3
    ) {
      setFormError("CEP internacional muito curto");
      return;
    }

    // Format payload
    const payload = {
      title: form.title,
      description: form.description,
      price: Math.floor(parseFloat(cleanedPrice) * 100),
      destination: form.destination,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      numberGuests: parseInt(form.numberGuests, 10),
      accommodationDetails: {
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
      packageType: parseInt(form.packageType, 10),
    };

    try {
      console.log("Submitting package creation:", payload);
      const packageResponse = await dispatch(
        createTravelPackage(payload)
      ).unwrap();
      console.log("Package response:", packageResponse);

      //const packageId = packageResponse[0]?.id;
      //console.log("Package ID:", packageId);

      const createdPackage = Array.isArray(packageResponse)
        ? packageResponse[0]
        : packageResponse;

      const packageId = createdPackage?.id;

      if (!packageId) {
        throw new Error("Package ID not found in response");
      }

      // Step 2: Upload media files if package creation succeeds
      if (mediaFiles.length > 0) {
        const formData = new FormData();
        mediaFiles.forEach((media, index) => {
          if (media.file instanceof File) {
            formData.append("files", media.file);
            formData.append(`files[${index}]`, media.file);
            /*             console.log(
              `Adicionado: ${media.file.name}, Size: ${media.file.size} bytes`
            ); */
          }
        });

        /*         console.log("FormData prepared with", mediaFiles.length, "files");
        console.log("Submitting media upload for packageId:", packageId); */
        const mediaResponse = await dispatch(
          uploadTravelPackageMedia({ packageId, formData })
        ).unwrap();
        console.log("Media upload response:", mediaResponse);
      }

      await dispatch(fetchTravelPackages());

      setMediaFiles([]);
      setFormSuccess("Pacote e mídias cadastrados com sucesso");
      setOpenSuccessModal(true);
      resetForm();
    } catch (err) {
      console.error("Submission error:", err);
      setFormError(
        reduxError || err.message || "Erro ao cadastrar pacote ou enviar mídias"
      );
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

  return (
    <Box sx={{ p: 2, maxWidth: "1330px", margin: "0 auto" }}>
      <Typography variant="h6" color="var(--orange-avanade)">
        Cadastro de Pacote
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}
      >
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Dados Gerais
        </Typography>
        <CustomTextfield
          label="Título *"
          name="title"
          value={form.title}
          onChange={onChangeForm}
          required
        />
        <CustomTextfield
          label="Descrição *"
          name="description"
          value={form.description}
          onChange={onChangeForm}
          required
        />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomTextfield
            label="Destino *"
            name="destination"
            value={form.destination}
            onChange={onChangeForm}
            required
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
          />
          <CustomDateField
            label="Data de Término *"
            name="endDate"
            value={form.endDate}
            onChange={onChangeForm}
            min={form.startDate}
            required
          />
          <CustomNumericField
            label="Nº max de Hóspedes *"
            name="numberGuests"
            value={form.numberGuests}
            onChange={onChangeForm}
            mask="0000"
            required
          />
          <CustomSelect
            label="Tipo de Pacote *"
            name="packageType"
            value={form.packageType}
            onChange={handlePackageTypeChange}
            options={[
              { value: 0, label: "Nacional" },
              { value: 1, label: "Internacional" },
            ]}
            required
          />
        </Box>

        <CustomCheckbox
          label="Está Ativo"
          name="isActive"
          checked={form.isActive}
          onChange={onChangeForm}
        />
        <CustomCheckbox
          label="Em Promoção"
          name="isPromo"
          checked={form.isPromo}
          onChange={onChangeForm}
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
              />
              <CustomDateField
                label="Início da Promoção *"
                name="promotionStartDate"
                value={form.promotionStartDate}
                onChange={onChangeForm}
                max={form.promotionEndDate}
                required
              />
              <CustomDateField
                label="Fim da Promoção *"
                name="promotionEndDate"
                value={form.promotionEndDate}
                onChange={onChangeForm}
                min={form.promotionStartDate}
                required
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
          />
          <CustomNumericField
            label="Número de Camas *"
            name="accommodationDetails.numberBeds"
            value={form.accommodationDetails.numberBeds}
            onChange={onChangeNestedForm}
            mask="000"
            required
          />
        </Box>
        <CustomCheckbox
          label="Wi-Fi"
          name="accommodationDetails.hasWifi"
          checked={form.accommodationDetails.hasWifi}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Estacionamento"
          name="accommodationDetails.hasParking"
          checked={form.accommodationDetails.hasParking}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Piscina"
          name="accommodationDetails.hasPool"
          checked={form.accommodationDetails.hasPool}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Academia"
          name="accommodationDetails.hasGym"
          checked={form.accommodationDetails.hasGym}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Restaurante"
          name="accommodationDetails.hasRestaurant"
          checked={form.accommodationDetails.hasRestaurant}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Pet Friendly"
          name="accommodationDetails.hasPetFriendly"
          checked={form.accommodationDetails.hasPetFriendly}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Ar-Condicionado"
          name="accommodationDetails.hasAirConditioning"
          checked={form.accommodationDetails.hasAirConditioning}
          onChange={onChangeNestedForm}
        />
        <CustomCheckbox
          label="Café da Manhã Incluso"
          name="accommodationDetails.hasBreakfastIncluded"
          checked={form.accommodationDetails.hasBreakfastIncluded}
          onChange={onChangeNestedForm}
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
          <CustomTextfield
            label="Logradouro *"
            name="accommodationDetails.address.addressLine1"
            value={form.accommodationDetails.address.addressLine1}
            onChange={onChangeNestedForm}
            required
          />
          {isInternational ? (
            <CustomTextfield
              label="Complemento *"
              name="accommodationDetails.address.addressLine2"
              value={form.accommodationDetails.address.addressLine2}
              onChange={onChangeNestedForm}
              disabled={
                isLoadingZipCode || !form.accommodationDetails.address.country
              }
            />
          ) : (
            <CustomNumericField
              label="Número *"
              name="accommodationDetails.address.addressLine2"
              value={form.accommodationDetails.address.addressLine2}
              onChange={onChangeNestedForm}
              mask="000000"
            />
          )}
          {isInternational ? (
            <CustomTextfield
              label="ZIP CODE *"
              name="accommodationDetails.address.zipCode"
              value={form.accommodationDetails.address.zipCode}
              onChange={handleZipCodeInputChange}
              required
              disabled={
                isLoadingZipCode || !form.accommodationDetails.address.country
              }
            />
          ) : (
            <Box sx={{ position: "relative", minWidth: "300px" }}>
              <CustomNumericField
                label="CEP *"
                name="accommodationDetails.address.zipCode"
                value={form.accommodationDetails.address.zipCode}
                onChange={handleZipCodeInputChange}
                required
                mask="00000-000"
                disabled={isLoadingZipCode}
                sx={{ width: "100%" }}
              />

              <Tooltip title="Procurar CEP" arrow>
                <Button
                  variant="contained"
                  onClick={handleZipCodeSearch}
                  disabled={isLoadingZipCode}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    minWidth: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "var(--orange-avanade)",
                    color: "white",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Box>
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
          <CustomTextfield
            label="País *"
            name="accommodationDetails.address.country"
            value={form.accommodationDetails.address.country}
            onChange={onChangeNestedForm}
            required
          />
          <CustomTextfield
            label="Estado *"
            name="accommodationDetails.address.state"
            value={form.accommodationDetails.address.state}
            onChange={onChangeNestedForm}
            required
          />
          <CustomTextfield
            label="Cidade *"
            name="accommodationDetails.address.city"
            value={form.accommodationDetails.address.city}
            onChange={onChangeNestedForm}
            required
          />
          <CustomTextfield
            label="Bairro *"
            name="accommodationDetails.address.neighborhood"
            value={form.accommodationDetails.address.neighborhood}
            onChange={onChangeNestedForm}
            required
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
          />
          <CustomNumericField
            label="Longitude *"
            name="accommodationDetails.address.longitude"
            value={form.accommodationDetails.address.longitude}
            onChange={onChangeNestedForm}
          />
        </Box>
        <Divider sx={{ my: 2, borderColor: "var(--no-active-tab)" }} />
        <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
          Mídias
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed var(--orange-avanade)",
            borderRadius: "4px",
            p: 2,
            textAlign: "center",
            backgroundColor: isDragActive
              ? "rgba(255, 165, 0, 0.1)"
              : "transparent",
            cursor: "pointer",
            mb: 2,
          }}
        >
          <input {...getInputProps()} />
          <Typography sx={{ color: "var(--text-footer)" }}>
            {isDragActive
              ? "Solte os arquivos aqui..."
              : "Arraste e solte imagens ou vídeos aqui, ou clique para selecionar arquivos"}
          </Typography>
        </Box>
        {mediaFiles.map((media, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Typography sx={{ color: "var(--text-footer)" }}>
              {media.file ? media.file.name : "Nenhum arquivo selecionado"}
            </Typography>
            <Button
              onClick={() => handleRemoveMedia(index)}
              variant="outlined"
              sx={{
                borderColor: "var(--orange-avanade)",
                color: "var(--orange-avanade)",
              }}
            >
              Remover
            </Button>
          </Box>
        ))}
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
            onClick={() => {
              resetForm();
              setMediaFiles([]);
            }}
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
        open={!!formError}
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
          <DialogContentText>{formSuccess}</DialogContentText>
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

export default PackageRegistration;
