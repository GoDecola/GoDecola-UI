import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { fetchUsers, createUser } from "../../../store/actions/userActions";
import { UserRegistration } from "./UserRegistration/UserRegistration";
import UsersList from "./UsersList/UsersList";
import { parseJwt } from "../../../utils/jwt";

export const UsersAdminTable = () => {
  const [value, setValue] = useState("1");
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers());
    } else {
      console.warn("Token não disponível, não buscando usuários.");
    }
  }, [dispatch, token]);

  const payload = parseJwt(token);

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">Erro: {error}</Typography>}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "var(--no-active-tab)" }}>
          <TabList
            onChange={handleChange}
            aria-label="tabs de Usuários"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              ".MuiTabs-flexContainer": {
                justifyContent: { xs: "flex-start", sm: "center" },
              },
              ".MuiTab-root": {
                minWidth: { xs: "auto", sm: 160 },
                padding: { xs: "6px 12px", sm: "12px 16px" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
            slotProps={{
              indicator: {
                sx: {
                  backgroundColor: "var(--orange-avanade)",
                },
              },
            }}
          >
            <Tab
              label="Listar Usuários"
              value="1"
              sx={{
                color: "var(--text-footer)",
                "&.Mui-selected": {
                  color: "var(--orange-avanade)",
                },
              }}
            />
            <Tab
              label="Criar"
              value="2"
              sx={{
                color: "var(--text-footer)",
                "&.Mui-selected": {
                  color: "var(--orange-avanade)",
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <UsersList
            clients={users || []}
            loading={loading}
            error={error}
            role={payload?.role}
          />
        </TabPanel>
        <TabPanel value="2">
          <UserRegistration createUser={createUser} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default UsersAdminTable;
