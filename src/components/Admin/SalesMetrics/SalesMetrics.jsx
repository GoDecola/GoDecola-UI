import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { fetchBookings } from "../../../store/actions/bookingActions";
import { getAllPayments } from "../../../store/actions/paymentActions";
import { fetchTravelPackages } from "../../../store/actions/travelPackagesActions";
import { CustomSelect } from "../../CustomInputs/CustomSelect";
import ExportButtons from "../../ExportButton/ExportButton";
import { useRef } from "react";

const SalesMetrics = () => {
  const dispatch = useDispatch();  
  const {
    bookings = [],
    loading: bookingLoading,
    error: bookingError,
  } = useSelector((state) => state.bookings || {});
  const {
    payments = [],
    loading: paymentLoading,
    error: paymentError,
  } = useSelector((state) => state.payments || {});
  const {
    packages = [],
    loading: packageLoading,
    error: packageError,
  } = useSelector((state) => state.travelPackages || {});
  const [timeRange, setTimeRange] = useState("30d");

  const contentRef = useRef();

  useEffect(() => {
    dispatch(fetchBookings());    
    dispatch(getAllPayments());
    dispatch(fetchTravelPackages());
  }, [dispatch]);

  // Helper function to filter data by time range
  const filterByTimeRange = (date, range) => {
    const now = new Date();
    const dateOnly = date.split(" ")[0]; // Extract YYYY-MM-DD from paymentDate
    const dateObj = new Date(dateOnly);
    if (isNaN(dateObj)) return false; // Skip invalid dates
    if (range === "30d") {
      return dateObj >= new Date(now.setDate(now.getDate() - 30));
    } else if (range === "90d") {
      return dateObj >= new Date(now.setDate(now.getDate() - 90));
    } else if (range === "6m") {
      return dateObj >= new Date(now.setMonth(now.getMonth() - 6));
    }
    return true;
  };

  // Color palette for charts
  const colors = [
    "#FF5800", // Orange- Avanade
    "#FFA500", // Orange
    "#2196F3", // Blue
    "#4CAF50", // Green
    "#F44336", // Red
    "#9C27B0", // Purple
    "#FF5722", // Deep Orange
    "#3F51B5", // Indigo
    "#FFC107", // Amber
    "#009688", // Teal
    "#E91E63", // Pink
  ];

  // Common chart styling for axes and text
  const chartAxisStyles = {
    "& .MuiChartsAxis-line": { stroke: "var(--no-active-tab)" },
    "& .MuiChartsAxis-tick": { stroke: "var(--no-active-tab)" },
    "& .MuiChartsAxis-label": { fill: "var(--no-active-tab)" },
    "& .MuiChartsLegend-root": { color: "var(--no-active-tab)" },
    "& .MuiChartsLegend-label": { fill: "var(--no-active-tab)" },
    "& .MuiChartsTooltip-tooltip": { color: "var(--no-active-tab)" },
    "& .MuiChartsPieArcLabel-root": { fill: "var(--no-active-tab)" },
    "& text": { fill: "var(--no-active-tab)" },
  };

  // Sales by Destination
  const salesByDestination = packages
    .map((pkg) => {
      const bookingsForPackage = bookings.filter(
        (b) =>
          b.travelPackageId === pkg.id &&
          filterByTimeRange(b.reservationDate, timeRange)
      );
      const totalSales = bookingsForPackage.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
      );
      return { destination: pkg.destination, sales: totalSales / 100 }; // Convert to R$
    })
    .filter((item) => item.sales > 0);

  // Booking Status Distribution
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(
    ([status, count], index) => ({
      id: status,
      value: count,
      label: status,
      color: colors[index % colors.length],
    })
  );

  // Payment Status Distribution
  const paymentStatusCounts = payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {});
  const paymentStatusData = Object.entries(paymentStatusCounts).map(
    ([status, count], index) => ({
      id: status,
      value: count,
      label: status,
      color: colors[(index + 2) % colors.length], 
    })
  );

  // Top Destinations by Bookings
  const bookingsByDestination = packages
    .map((pkg) => {
      const count = bookings.filter(
        (b) =>
          b.travelPackageId === pkg.id &&
          filterByTimeRange(b.reservationDate, timeRange)
      ).length;
      return { destination: pkg.destination, bookings: count };
    })
    .filter((item) => item.bookings > 0);

  // Promotion Impact
  const promotionData = [
    {
      label: "Em Promoção",
      value: bookings
        .filter((b) => {
          const pkg = packages.find((p) => p.id === b.travelPackageId);
          return (
            pkg?.isCurrentlyOnPromotion &&
            filterByTimeRange(b.reservationDate, timeRange)
          );
        })
        .reduce((sum, b) => sum + (b.totalPrice || 0) / 100, 0),
    },
    {
      label: "Sem Promoção",
      value: bookings
        .filter((b) => {
          const pkg = packages.find((p) => p.id === b.travelPackageId);
          return (
            !pkg?.isCurrentlyOnPromotion &&
            filterByTimeRange(b.reservationDate, timeRange)
          );
        })
        .reduce((sum, b) => sum + (b.totalPrice || 0) / 100, 0),
    },
  ].filter((item) => item.value > 0);

  // Package Types Distribution
  const packageTypesData = [
    {
      id: "Nacional",
      value: packages.filter((p) => p.packageType === "Nacional").length,
      label: "Nacional",
      color: colors[1], // Blue
    },
    {
      id: "Internacional",
      value: packages.filter((p) => p.packageType !== "Nacional").length,
      label: "Internacional",
      color: colors[4], // Purple
    },
    {
      id: "Nacional em Promoção",
      value: packages.filter(
        (p) => p.packageType === "Nacional" && p.isCurrentlyOnPromotion
      ).length,
      label: "Nacional em Promoção",
      color: colors[2], // Green
    },
    {
      id: "Internacional em Promoção",
      value: packages.filter(
        (p) => p.packageType !== "Nacional" && p.isCurrentlyOnPromotion
      ).length,
      label: "Internacional em Promoção",
      color: colors[0], // Orange
    },
  ].filter((item) => item.value > 0);

  // Average Booking Value by Destination
  const avgBookingValue = packages
    .map((pkg) => {
      const bookingsForPackage = bookings.filter(
        (b) =>
          b.travelPackageId === pkg.id &&
          filterByTimeRange(b.reservationDate, timeRange)
      );
      const total = bookingsForPackage.reduce(
        (sum, b) => sum + (b.totalPrice || 0) / 100,
        0
      );
      const count = bookingsForPackage.length;
      return {
        destination: pkg.destination,
        avgValue: count > 0 ? total / count : 0,
      };
    })
    .filter((item) => item.avgValue > 0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 2,
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        backgroundColor: "var(--footer-bg)",
      }}
    >
      <ExportButtons onlyPdf targetRef={contentRef} />
      <Paper ref={contentRef}
        sx={{
          height: "auto",
          width: "100%",
          maxWidth: "1400px",
          backgroundColor: "var(--footer-bg)",
          boxShadow: "none",
          p: 2,
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: "var(--orange-avanade)", fontWeight: "bold" }}
          >
            Painel de Métricas de Vendas
          </Typography>
        </Box>

        {(bookingLoading ||          
          paymentLoading ||
          packageLoading) && (
          <Typography color="var(--primary-text-color)">
            Carregando...
          </Typography>
        )}
        {(bookingError ||  paymentError || packageError) && (
          <Typography color="error">
            Erro: {bookingError  || paymentError || packageError}
          </Typography>
        )}
        {!(
          bookingLoading ||          
          paymentLoading ||
          packageLoading ||
          bookingError ||          
          paymentError ||
          packageError
        ) && (
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ width: 200 }}>
              <CustomSelect
                label="Período"
                name="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                options={[
                  { value: "30d", label: "Últimos 30 dias" },
                  { value: "90d", label: "Últimos 90 dias" },
                  { value: "6m", label: "Últimos 6 meses" },
                  { value: "all", label: "Todo o período" },
                ]}
              />
            </Box>
          </Box>
        )}

        {/* Sales by Destination */}
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ color: "var(--text-footer)", mb: 2 }}>
            Vendas por Destino (R$)
          </Typography>
          {salesByDestination.length > 0 ? (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Destinos"],
                  tickLabelStyle: {
                    fill: "var(--no-active-tab)",
                  },
                  lineStyle: {
                    stroke: "var(--no-active-tab)",
                  },
                  tickStyle: {
                    stroke: "var(--no-active-tab)",
                  },
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: {
                    fill: "var(--no-active-tab)",
                  },
                  lineStyle: {
                    stroke: "var(--no-active-tab)",
                  },
                  tickStyle: {
                    stroke: "var(--no-active-tab)",
                  },
                },
              ]}
              series={salesByDestination.map((item, index) => ({
                data: [item.sales],
                label: item.destination,
                color: colors[index % colors.length],
              }))}
              height={300}
              sx={chartAxisStyles}
            />
          ) : (
            <Typography color="var(--text-footer)">
              Nenhum dado disponível
            </Typography>
          )}
        </Box>

        <Divider
          sx={{
            my: 4,
            borderColor: "var(--no-active-tab)",
          }}
        />

        {/* Promotion Impact & Package Types Distribution */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Promotion Impact */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ color: "var(--text-footer)" }}>
              Impacto de Promoções (R$)
            </Typography>
            {promotionData.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: "band", data: ["Promoções"] }]}
                series={promotionData.map((item, index) => ({
                  data: [item.value],
                  label: item.label,
                  color: index === 0 ? colors[2] : colors[3],
                }))}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fill: "var(--no-active-tab)",
                    },
                    lineStyle: {
                      stroke: "var(--no-active-tab)",
                    },
                    tickStyle: {
                      stroke: "var(--no-active-tab)",
                    },
                  },
                ]}
                height={300}
                sx={chartAxisStyles}
              />
            ) : (
              <Typography color="var(--text-footer)">
                Nenhum dado disponível
              </Typography>
            )}
          </Box>

          {/* Divider responsivo */}
          <Divider
            orientation={{ xs: "horizontal", md: "vertical" }}
            flexItem
            sx={{
              my: { xs: 4, md: 0 },
              mx: { xs: 0, md: 4 },
              borderColor: "var(--no-active-tab)",
              borderRightWidth: { xs: 0, md: 2 },
              borderBottomWidth: { xs: 2, md: 0 },
              height: { xs: "auto", md: "300px" },
            }}
          />

          {/* Package Types Distribution */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{ color: "var(--text-footer)", mb: 2 }}
            >
              Distribuição de Tipos de Pacotes
            </Typography>
            {packageTypesData.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: packageTypesData,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  },
                ]}
                height={300}
                sx={chartAxisStyles}
              />
            ) : (
              <Typography color="var(--text-footer)">
                Nenhum dado disponível
              </Typography>
            )}
          </Box>
        </Box>

        <Divider
          sx={{
            my: 4,
            borderColor: "var(--no-active-tab)",
          }}
        />

        {/* Top Destinations by Bookings and Stacked Charts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" }, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ color: "var(--text-footer)", mb: 2 }}
            >
              Principais Destinos por Reservas
            </Typography>
            {bookingsByDestination.length > 0 ? (
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Destinos"],
                    tickLabelStyle: {
                      fill: "var(--no-active-tab)",
                    },
                    lineStyle: {
                      stroke: "var(--no-active-tab)",
                    },
                    tickStyle: {
                      stroke: "var(--no-active-tab)",
                    },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fill: "var(--no-active-tab)",
                    },
                    lineStyle: {
                      stroke: "var(--no-active-tab)",
                    },
                    tickStyle: {
                      stroke: "var(--no-active-tab)",
                    },
                  },
                ]}
                series={bookingsByDestination.map((item, index) => ({
                  data: [item.bookings],
                  label: item.destination,
                  color: colors[index % colors.length],
                }))}
                height={300}
                sx={chartAxisStyles}
              />
            ) : (
              <Typography color="var(--text-footer)">
                Nenhum dado disponível
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 50%" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Divider
              sx={{
                my: 4,
                borderColor: "var(--no-active-tab)",
              }}
            />

            {/* Distribution of Reservation and Payment Status */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                justifyContent: "space-between",
              }}
            >
              {/* Distribution of Reservation Status */}
              <Box
                sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" }, minWidth: 0 }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "var(--text-footer)", mb: 2 }}
                >
                  Distribuição de Status das Reservas
                </Typography>
                {statusData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: statusData,
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                      },
                    ]}
                    height={200}
                    sx={chartAxisStyles}
                  />
                ) : (
                  <Typography color="var(--text-footer)">
                    Nenhum dado disponível
                  </Typography>
                )}
              </Box>

              {/* Divider responsivo */}
              <Divider
                orientation={{ xs: "horizontal", md: "vertical" }}
                flexItem
                sx={{
                  my: { xs: 4, md: 0 },
                  mx: { xs: 0, md: 4 },
                  borderColor: "var(--no-active-tab)",
                  borderRightWidth: { xs: 0, md: 2 },
                  borderBottomWidth: { xs: 2, md: 0 },
                  height: { xs: "auto", md: "300px" },
                }}
              />

              {/* Distribution of Payment Status */}
              <Box
                sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" }, minWidth: 0 }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "var(--text-footer)", mb: 2 }}
                >
                  Distribuição de Status dos Pagamentos
                </Typography>
                {paymentStatusData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: paymentStatusData,
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                      },
                    ]}
                    height={200}
                    sx={chartAxisStyles}
                  />
                ) : (
                  <Typography color="var(--text-footer)">
                    Nenhum dado disponível
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider
              sx={{
                my: 4,
                borderColor: "var(--no-active-tab)",
              }}
            />

            {/* Average Booking Value by Destination (R$) */}
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "var(--text-footer)", mb: 2 }}
              >
                Valor Médio de Reserva por Destino (R$)
              </Typography>
              {avgBookingValue.length > 0 ? (
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["Destinos"],
                      tickLabelStyle: {
                        fill: "var(--no-active-tab)",
                      },
                      lineStyle: {
                        stroke: "var(--no-active-tab)",
                      },
                      tickStyle: {
                        stroke: "var(--no-active-tab)",
                      },
                    },
                  ]}
                  yAxis={[
                    {
                      tickLabelStyle: {
                        fill: "var(--no-active-tab)",
                      },
                      lineStyle: {
                        stroke: "var(--no-active-tab)",
                      },
                      tickStyle: {
                        stroke: "var(--no-active-tab)",
                      },
                    },
                  ]}
                  series={avgBookingValue.map((item, index) => ({
                    data: [item.avgValue],
                    label: item.destination,
                    color: colors[index % colors.length],
                  }))}
                  height={200}
                  sx={chartAxisStyles}
                />
              ) : (
                <Typography color="var(--text-footer)">
                  Nenhum dado disponível
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesMetrics;
