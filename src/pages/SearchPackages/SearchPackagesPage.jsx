import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useForm } from "../../hooks/useForm";
import { CustomTextfield } from "../../components/CustomInputs/CustomTextfield";
import { CustomNumericField } from "../../components/CustomInputs/CustomNumericField";
import { CustomDateField } from "../../components/CustomInputs/CustomDateField";
import { CustomPriceField } from "../../components/CustomInputs/CustomPriceField";
import { PackageCardSearch } from "../../components/PackageCardSearch/PackageCardSearch";
import useIsMobile from "../../hooks/useIsMobile";
import { fetchTravelPackagesByFilter } from "../../store/actions/travelPackagesActions";
import { formatDate } from "../../utils/formatDate";

const SearchPackagesPage = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const {
    loading,
    error: reduxError,
    filteredPackages = [],
  } = useSelector((state) => state.travelPackages);
  const [formError, setFormError] = useState(null);
  
  

  const today = new Date().toISOString().slice(0, 10);
const initialState = {
  destination: "",
  minPrice: "",
  maxPrice: "",
  startDate: "",
  endDate: "",
  numberGuests: "1",
};

  const { form, onChangeForm, resetForm } = useForm(initialState);

  const handleSearch = useCallback(async () => {
    setFormError(null);

    // Validation
    const numberGuests = form.numberGuests
      ? parseInt(form.numberGuests, 10)
      : null;

const minPrice = form.minPrice !== "" ? parseFloat(form.minPrice) : null;
const maxPrice = form.maxPrice !== "" ? parseFloat(form.maxPrice) : null;

if ((minPrice !== null && isNaN(minPrice)) || (maxPrice !== null && isNaN(maxPrice))) {
  setFormError("Preços mínimo e máximo devem ser valores válidos");
  return;
}

if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
  setFormError("Preço mínimo não pode ser maior que o preço máximo");
  return;
}
    if (numberGuests !== null && (isNaN(numberGuests) || numberGuests < 1)) {
      setFormError("Número de hóspedes deve ser pelo menos 1");
      return;
    }

    try {
      const filters = {
        destination: form.destination || undefined,
  minPrice: minPrice !== null ? Math.floor(minPrice * 100) : undefined,
  maxPrice: maxPrice !== null ? Math.floor(maxPrice * 100) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        numberGuests: numberGuests || undefined,
      };

      // Construir os parâmetros da query
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });

       const path = `/travel-packages/filter?${params.toString()}`;
      console.log("Requisição GET para o path:", path);
      console.log("Search filters:", filters);

      const result = await dispatch(
        fetchTravelPackagesByFilter(filters)
      ).unwrap();
      console.log("Filtered packages received:", result); 
      await dispatch(fetchTravelPackagesByFilter(filters)).unwrap();
    } catch (error) {
      setFormError(reduxError || error.message || "Erro ao buscar pacotes");
      console.error("Erro ao buscar pacotes:", error);
    }
  }, [dispatch, form, reduxError]);

  return (
    <Box   sx={{
    padding: '2rem',
    paddingBottom: '50px',
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--background-color)',
  }}>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        width: "100%",
        maxWidth: "1310px",
        margin: "0 auto",
        backgroundColor: "var(--background-color)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "var(--primary-text-color)" }}
        >
          Buscar Pacotes
        </Typography>

        <CustomTextfield
          label="Destino"
          name="destination"
          value={form.destination}
          onChange={onChangeForm}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "var(--primary-text-color)" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <CustomDateField
            label="Data de Início"
            name="startDate"
            value={form.startDate}
            onChange={onChangeForm}
            min={today}
          />
          <CustomDateField
            label="Data de Término"
            name="endDate"
            value={form.endDate}
            onChange={onChangeForm}
            min={form.startDate || today}
          />
          <CustomNumericField
            label="Nº de Hóspedes"
            name="numberGuests"
            value={form.numberGuests}
            onChange={onChangeForm}
            mask="0000"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            mt: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "var(--text-footer)" }}>
            Faixa de Preço
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <CustomPriceField
              label="Preço Mínimo (R$)"
              name="minPrice"
              value={form.minPrice}
              onChange={onChangeForm}
              mask={{
                prefix: "R$ ",
                thousandSeparator: ",",
                decimalSeparator: ".",
                decimalScale: 2,
                fixedDecimalScale: true,
              }}
              max={form.maxPrice}
            />
            <CustomPriceField
              label="Preço Máximo (R$)"
              name="maxPrice"
              value={form.maxPrice}
              onChange={onChangeForm}
              mask={{
                prefix: "R$ ",
                thousandSeparator: ",",
                decimalSeparator: ".",
                decimalScale: 2,
                fixedDecimalScale: true,
              }}
              min={form.minPrice}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            disabled={loading}
            sx={{ backgroundColor: "var(--orange-avanade)", color: "white" }}
          >
            Buscar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => resetForm()}
            sx={{
              borderColor: "var(--orange-avanade)",
              color: "var(--orange-avanade)",
            }}
          >
            Limpar
          </Button>
        </Box>

        {filteredPackages.length === 0 && !loading && (
          <Typography
            sx={{ mt: 2, color: "var(--text-footer)", textAlign: "center" }}
          >
            Nenhuma reserva encontrada com os filtros selecionados.
          </Typography>
        )}

        {filteredPackages.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: {xs:5, md: 3},
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {filteredPackages.map((pacote) => (
              <Box key={pacote.id}>
                <PackageCardSearch
                  id={pacote.id}
                  title={pacote.title}
                  price={pacote.price}
                  rating={pacote.rating}
                  imageSrc={pacote.mediasUrl}
                  isCurrentlyOnPromotion={pacote.isCurrentlyOnPromotion}
                  discountPercentage={pacote.discountPercentage}
                  startDate={formatDate(pacote.startDate)}
                  endDate={formatDate(pacote.endDate)}
                />
              </Box>
            ))}
          </Box>
        )}

        <Snackbar
          open={!!formError}
          autoHideDuration={6000}
          onClose={() => setFormError(null)}
        >
          <Alert severity="error" onClose={() => setFormError(null)}>
            {formError || reduxError}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
    </Box>
  );
};

export default SearchPackagesPage;
