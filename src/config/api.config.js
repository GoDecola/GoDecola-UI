// Configuração centralizada da API
export const API_CONFIG = {
  // URL base do backend - ajuste conforme necessário
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:7109/api",
  
  // Timeout para requisições (30 segundos)
  TIMEOUT: 30000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
  
  // Configurações do Mercado Pago
  MERCADO_PAGO: {
    PUBLIC_KEY: import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-d9688230-b4e5-44fc-b5f4-3dcdaa1fbbe2',
    LOCALE: 'pt',
  },
};

// Função para verificar se o backend está online
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend não está disponível:', error);
    return false;
  }
};

// Função para modo de desenvolvimento/mock
export const isDevelopmentMode = () => {
  return import.meta.env.MODE === 'development' || !import.meta.env.VITE_API_URL;
};
