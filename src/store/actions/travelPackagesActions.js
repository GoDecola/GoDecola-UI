import { createAsyncThunk } from '@reduxjs/toolkit';
import travelPackageService from '../../services/travelPackageService';

const transformPackageData = (packageData) => {
    const packageTypeMap = {
        NATIONAL: 'Nacional',
        INTERNATIONAL: 'Internacional',
    };

    const getMediaType = (mimeType) => {
        if (!mimeType) return 'desconhecido';
        if (mimeType.startsWith('image/')) return 'imagem';
        if (mimeType.startsWith('video/')) return 'video';
        return 'desconhecido';
    };

    const transformSinglePackage = (pkg) => {
        const formattedPrice = (parseFloat(pkg.price) / 100).toFixed(2);
        const isCurrentlyOnPromotion = pkg.isCurrentlyOnPromotion ?? (pkg.promotionStartDate && pkg.promotionEndDate ? true : false);
/*         console.log("transformSinglePackage:", {
            id: pkg.id,
            promotionStartDate: pkg.promotionStartDate,
            promotionEndDate: pkg.promotionEndDate,
            isCurrentlyOnPromotion,
            apiIsCurrentlyOnPromotion: pkg.isCurrentlyOnPromotion,
        }); */

        return {
            ...pkg,
            price: formattedPrice,
            packageType: packageTypeMap[pkg.packageType] || pkg.packageType,
            mediasUrl: pkg.mediasUrl?.map((media) => ({
                ...media,
                mediaType: getMediaType(media.mimeType),
            })) || [],
            isCurrentlyOnPromotion,
        };
    };

    const activePackages = Array.isArray(packageData)
        ? packageData.filter((pkg) => pkg.isActive)
        : packageData.isActive ? [packageData] : [];

    return activePackages.map(transformSinglePackage);
};

export const fetchTravelPackages = createAsyncThunk(
  'travelPackages/fetchTravelPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await travelPackageService.getTravelPackages();
      console.log("fetchTravelPackages response:", response);
      return transformPackageData(response);
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTravelPackagesByFilter = createAsyncThunk(
  'travelPackages/fetchTravelPackagesByFilter',
  async (filters, { rejectWithValue }) => {
    try {
      console.log('Filtros enviados para o serviço:', filters);
      const response = await travelPackageService.travelPackagesFilter(filters);
      console.log('Resposta do serviço:', response);
      return transformPackageData(response);
    } catch (error) {
      console.error('Erro ao buscar pacotes filtrados:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTravelPackageById = createAsyncThunk(
  'travelPackages/fetchTravelPackageById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await travelPackageService.getTravelPackageById(id);
      return transformPackageData(response);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pacote:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTravelPackage = createAsyncThunk(
  'travelPackages/createTravelPackage',
  async (packageData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await travelPackageService.createTravelPackage(packageData, auth.token);
      console.log('Pacote criado:', response);
      return transformPackageData(response);
    } catch (error) {
      console.error('Erro ao criar pacote:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadTravelPackageMedia = createAsyncThunk(
  'travelPackages/uploadTravelPackageMedia',
  async ({ packageId, formData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      console.log("Auth token:", auth.token ? auth.token.substring(0, 10) + "..." : "No token");
      const response = await travelPackageService.uploadTravelPackageMedia(packageId, formData, auth.token);
      console.log('Mídias enviadas:', response);
      return response;
    } catch (error) {
      console.error('Erro ao enviar mídias:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    serializeError: (error) => error.message || error,
    getPendingMeta: ({ packageId }) => ({ packageId }), // Exclude formData
  }
);

export const updateTravelPackageById = createAsyncThunk(
  'travelPackages/updateTravelPackageById',
  async ({ id, packageData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await travelPackageService.updateTravelPackageById(id, packageData, auth.token);
      console.log('Pacote atualizado:', response);
      return transformPackageData(response);
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTravelPackageById = createAsyncThunk(
  'travelPackages/deleteTravelPackageById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await travelPackageService.deleteTravelPackageById(id, auth.token);
      console.log('Pacote excluído:', id);
      return id;
    } catch (error) {
      console.error('Erro ao excluir pacote:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);