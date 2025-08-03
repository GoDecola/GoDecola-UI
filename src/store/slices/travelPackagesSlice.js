import { createSlice } from "@reduxjs/toolkit";
import { fetchTravelPackages, fetchTravelPackageById, createTravelPackage, updateTravelPackageById, deleteTravelPackageById, uploadTravelPackageMedia } from "../actions/travelPackagesActions";

const initialState = {
  packages: [],
  packageDetails: null,
  loading: false,
  error: null,
};

const travelPackagesSlice = createSlice({
  name: "travelPackages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTravelPackages
      .addCase(fetchTravelPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
        state.error = null;
      })
      .addCase(fetchTravelPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTravelPackageById
      .addCase(fetchTravelPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.packageDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchTravelPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createTravelPackage
      .addCase(createTravelPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTravelPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = [...state.packages, action.payload];
        state.error = null;
      })
      .addCase(createTravelPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateTravelPackageById
      .addCase(updateTravelPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTravelPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.map((pkg) =>
          pkg.id === action.payload.id ? action.payload : pkg
        );
        state.error = null;
      })
      .addCase(updateTravelPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // uploadTravelPackageMedia
      .addCase(uploadTravelPackageMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadTravelPackageMedia.fulfilled, (state, action) => {
        console.log('Fulfilled payload:', action.payload);
        state.loading = false;
        state.packages = state.packages.map((pkg) =>
          pkg.id === action.payload[0]?.travelPackageId
            ? {
              ...pkg,
              mediasUrl: action.payload.map((media) => ({
                mediaUrl: media.filePath,
                mediaType: media.mimeType.startsWith('image/') ? 'imagem' : 'video',
                mimeType: media.mimeType,
              })),
            }
            : pkg
        );
        state.error = null;
      })
      .addCase(uploadTravelPackageMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao enviar mídias';
        console.log('Rejected error:', action.payload);
      })
      // deleteTravelPackageById
      .addCase(deleteTravelPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter((pkg) => pkg.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTravelPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearPackageDetails } = travelPackagesSlice.actions;
export default travelPackagesSlice.reducer;