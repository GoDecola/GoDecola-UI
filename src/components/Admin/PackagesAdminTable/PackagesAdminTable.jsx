import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import {
  fetchTravelPackages,
  fetchTravelPackageById,
  createTravelPackage,
  updateTravelPackageById,
  deleteTravelPackageById,
} from "../../../store/actions/travelPackagesActions";
import { clearPackageDetails } from "../../../store/slices/travelPackagesSlice";
import { PackageEdit } from "./PackageEdit/PackageEdit";
import { PackageRegistration } from "./PackageRegistration/PackageRegistration";
import PackagesList from "./PackagesList/PackagesList";
import { parseJwt } from '../../../utils/jwt'

export const PackagesAdminTable = () => {
  const [value, setValue] = useState('1');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector((state) => state.travelPackages);
  const { token } = useSelector((state) => state.auth);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== '3') {
      setSelectedPackageId(null);
      dispatch(clearPackageDetails());
    }
  };
 
  const handleEdit = (id) => {
    setSelectedPackageId(id);
    setValue('3');
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchTravelPackages());
    }
  }, [dispatch, token]);

  const payload = parseJwt(token);

  return (
    <Box sx={{ width: '100%', typography: 'body1', p: 2 }}>
      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">Erro: {error}</Typography>}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'var(--no-active-tab)' }}>
          <TabList
            onChange={handleChange}
            aria-label="tabs de Pacotes"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '.MuiTabs-flexContainer': {
                justifyContent: { xs: 'flex-start', sm: 'center' },
              },
              '.MuiTab-root': {
                minWidth: { xs: 'auto', sm: 160 },
                padding: { xs: '6px 12px', sm: '12px 16px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
            slotProps={{
              indicator: {
                sx: {
                  backgroundColor: 'var(--orange-avanade)',
                },
              },
            }}
          >
            <Tab
              label="Lista de Pacotes"
              value="1"
              sx={{
                color: 'var(--text-footer)',
                '&.Mui-selected': {
                  color: 'var(--orange-avanade)',
                },
              }}
            />
            <Tab
              label="Cadastro de Pacote"
              value="2"
              sx={{
                color: 'var(--text-footer)',
                '&.Mui-selected': {
                  color: 'var(--orange-avanade)',
                },
              }}
            />
            <Tab
              label="Editar Pacote"
              value="3"
              sx={{
                color: 'var(--text-footer)',
                '&.Mui-selected': {
                  color: 'var(--orange-avanade)',
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <PackagesList
            packages={packages}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            role={payload.role}
          />
        </TabPanel>
        <TabPanel value="2">
          <PackageRegistration createTravelPackage={createTravelPackage} />
        </TabPanel>
        <TabPanel value="3">
          <PackageEdit
            packages={packages}
            fetchTravelPackageById={fetchTravelPackageById}
            updateTravelPackageById={updateTravelPackageById}
            deleteTravelPackageById={deleteTravelPackageById}
            clearPackageDetails={clearPackageDetails}
            selectedPackageId={selectedPackageId}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};