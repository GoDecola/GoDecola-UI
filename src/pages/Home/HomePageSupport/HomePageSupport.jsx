import "./HomePageSupport.css";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import useIsMobile from "../../../hooks/useIsMobile";
import { useDispatch, useSelector } from "react-redux";
import { fetchTravelPackages } from "../../../store/actions/travelPackagesActions";
import { fetchUsers } from "../../../store/actions/userActions";
import { fetchBookings } from "../../../store/actions/bookingActions";
import PackagesList from "../../../components/Admin/PackagesAdminTable/PackagesList/PackagesList";
import { parseJwt } from "../../../utils/jwt";
import BookingsAdminTable from "../../../components/Admin/BookingsAdminTable/BookingsAdminTable";
import UserList from "../../../components/Admin/UsersAdminTable/UsersList/UsersList";

const HomePageSupport = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("packages");
  const {
    packages,
    loading: packagesLoading,
    error: packagesError,
  } = useSelector((state) => state.travelPackages);
  const { users, loading, error } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const payload = parseJwt(token);

  useEffect(() => {
    if (token) {
      dispatch(fetchTravelPackages());
      dispatch(fetchUsers());
      dispatch(fetchBookings());
    }
  }, [dispatch, token]);

  const handleShowClients = () => {
    setActiveSection("clients");
  };

  const handleShowBookings = () => {
    setActiveSection("bookings");
  };

  const handleShowPackagesDefault = () => {
    setActiveSection("packages");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "clients":
        return (
          <>
            <h2 className="SupportTitle">Lista de Clientes</h2>
            <UserList
              clients={users || []}
              loading={loading}
              error={error}
              role={payload?.role}
            />
          </>
        );
      case "bookings":
        return (
          <>
            <h2 className="SupportTitle">Lista de Reservas</h2>
            <BookingsAdminTable />
          </>
        );
      case "packages":
        return (
          <>
            <h2 className="SupportTitle">Lista de Pacotes</h2>
            <PackagesList
              packages={packages}
              loading={packagesLoading}
              error={packagesError}
              role={payload.role}
            />
          </>
        );
      default:
        return (
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              textAlign: "center",
              color: "var(--primary-text-color)",
            }}
          >
            Selecione uma opção para gerenciar.
          </Typography>
        );
    }
  };

  return (
    <div
      className="homepageSupport-container"
      style={{
        padding: isMobile ? "0px 0px 30px" : "40px 50px 50px",
      }}
    >
      <Box
        sx={{
          width: "auto",
          mb: 4,
          display: "flex",
          gap: 2,
          alignItems: "center",
          mt: isMobile ? 4 : 0,
          ml: isMobile ? "auto" : 0,
          mr: isMobile ? "auto" : 0,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleShowPackagesDefault}
          sx={{
            width: "120px",
            height: "55px",
            textTransform: "none",
            transition: "none",
            color:
              activeSection === "packages"
                ? "var(--orange-avanade)"
                : "var(--text-footer)",
            borderColor:
              activeSection === "packages"
                ? "var(--orange-avanade)"
                : "var(--no-active-tab)",
            "&:hover": {
              color: "var(--orange-avanade)",
              borderColor: "var(--orange-avanade)",
              backgroundColor: "var(--icons-login-hover)",
            },
          }}
        >
          Pacotes
        </Button>

        <Button
          variant="outlined"
          onClick={handleShowClients}
          sx={{
            width: "120px",
            height: "55px",
            textTransform: "none",
            transition: "none",
            color:
              activeSection === "clients"
                ? "var(--orange-avanade)"
                : "var(--text-footer)",
            borderColor:
              activeSection === "clients"
                ? "var(--orange-avanade)"
                : "var(--no-active-tab)",
            "&:hover": {
              color: "var(--orange-avanade)",
              borderColor: "var(--orange-avanade)",
              backgroundColor: "var(--icons-login-hover)",
            },
          }}
        >
          Clientes
        </Button>

        <Button
          variant="outlined"
          onClick={handleShowBookings}
          sx={{
            width: "120px",
            height: "55px",
            textTransform: "none",
            transition: "none",
            color:
              activeSection === "bookings"
                ? "var(--orange-avanade)"
                : "var(--text-footer)",
            borderColor:
              activeSection === "bookings"
                ? "var(--orange-avanade)"
                : "var(--no-active-tab)",
            "&:hover": {
              color: "var(--orange-avanade)",
              borderColor: "var(--orange-avanade)",
              backgroundColor: "var(--icons-login-hover)",
            },
          }}
        >
          Reservas
        </Button>
      </Box>

      <Box
        sx={{
          p: isMobile ? 0 : 3,
          border: isMobile ? "none" : "1px solid var(--no-active-tab)",
          borderRadius: "8px",
          height: "auto",
          width: "100%",
          backgroundColor: "var(--footer-bg)",
        }}
      >
        {renderContent()}
      </Box>
    </div>
  );
};

export default HomePageSupport;
