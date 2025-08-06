// import React, { useEffect, useState } from 'react';
// import { API_CONFIG, checkBackendHealth, isDevelopmentMode } from '../config/api.config';
// import { Box, Typography, Alert, Chip } from '@mui/material';

// export default function DebugInfo() {
//   const [debugInfo, setDebugInfo] = useState({
//     mercadoPagoLoaded: false,
//     backendOnline: false,
//     devMode: false,
//     config: null
//   });

//   useEffect(() => {
//     const checkSystemStatus = async () => {
//       const backendStatus = await checkBackendHealth();
      
//       setDebugInfo({
//         mercadoPagoLoaded: !!window.MercadoPago,
//         backendOnline: backendStatus,
//         devMode: isDevelopmentMode(),
//         config: API_CONFIG
//       });
//     };

//     checkSystemStatus();
//   }, []);

//   return (
//     <Box sx={{ p: 2, mb: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
//       <Typography variant="h6" gutterBottom>
//         Status do Sistema
//       </Typography>
      
//       <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
//         <Chip 
//           label={`MercadoPago: ${debugInfo.mercadoPagoLoaded ? 'OK' : 'ERRO'}`}
//           color={debugInfo.mercadoPagoLoaded ? 'success' : 'error'}
//           size="small"
//         />
//         <Chip 
//           label={`Backend: ${debugInfo.backendOnline ? 'ONLINE' : 'OFFLINE'}`}
//           color={debugInfo.backendOnline ? 'success' : 'warning'}
//           size="small"
//         />
//         <Chip 
//           label={`Modo: ${debugInfo.devMode ? 'DESENVOLVIMENTO' : 'PRODUÇÃO'}`}
//           color={debugInfo.devMode ? 'info' : 'default'}
//           size="small"
//         />
//       </Box>

//       {!debugInfo.mercadoPagoLoaded && (
//         <Alert severity="error" sx={{ mb: 1 }}>
//           SDK do MercadoPago não carregado. Verifique a conexão com a internet.
//         </Alert>
//       )}

//       {!debugInfo.backendOnline && (
//         <Alert severity="warning" sx={{ mb: 1 }}>
//           Backend offline. Usando modo de desenvolvimento.
//         </Alert>
//       )}

//       <Typography variant="body2" sx={{ mt: 1 }}>
//         <strong>URL da API:</strong> {debugInfo.config?.BASE_URL}
//       </Typography>
//       <Typography variant="body2">
//         <strong>Chave MP:</strong> {debugInfo.config?.MERCADO_PAGO?.PUBLIC_KEY?.substring(0, 20)}...
//       </Typography>
//     </Box>
//   );
// }
