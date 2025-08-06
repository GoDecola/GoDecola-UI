import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../store/actions/wishlistAction";
import { fetchTravelPackages } from "../../store/actions/travelPackagesActions";
import { Box, Typography } from "@mui/material";
import { PackageCard } from "../../components/PackageCard/PackageCard";
import "./WishListPage.css";

export default function WishListPage() {
  const dispatch = useDispatch();
  const {
    items: wishlists,
    loading: wishlistLoading,
    error: wishlistError,
  } = useSelector((state) => state.wishlist);
  const {
    packages,
    loading: packagesLoading,
    error: packagesError,
  } = useSelector((state) => state.travelPackages);

  useEffect(() => {
    dispatch(fetchWishlist());
    dispatch(fetchTravelPackages());
  }, [dispatch]);

  const wishlistPackages =
    packages?.filter((pkg) =>
      wishlists.some((item) => item.travelPackageId === pkg.id)
    ) || [];

  return (
    <Box
      sx={{
        padding: "2rem",
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--background-color)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "var(--background-color)",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          minHeight: "59vh",
          flexDirection: "column",
          gap: 2,
          maxWidth: "1330px",
          mx: "auto",
          pt: { xs: 3, sm: 5 },
          pb: { xs: 0, sm: 10 },
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ color: "var(--orange-avanade)", fontWeight: "bold", mb: 3 }}
          >
            Minha Lista de Desejos
          </Typography>
        </Box>

        {wishlistLoading || packagesLoading ? (
          <Typography sx={{ color: "var(--primary-text-color)", mt: 10 }}>
            Carregando...
          </Typography>
        ) : wishlistError || packagesError ? (
          <Typography sx={{ color: "var(--no-active-tab)", mt: 10 }}>
            Erro ao carregar lista de desejos: {wishlistError || packagesError}
          </Typography>
        ) : wishlistPackages.length === 0 ? (
          <Typography sx={{ color: "var(--no-active-tab)", mt: 10 }}>
            Sua lista de desejos está vazia. Adicione pacotes de viagem à sua
            wishlist para vê-los aqui!
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: { xs: 3, sm: 5 },
              width: "100%",
              justifyContent: { xs: "center", sm: "center" },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            {wishlistPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.title || "Pacote Indisponível"}
                price={pkg.price}
                averageRating={pkg.averageRating || null}
                imageSrc={pkg.mediasUrl}
                isCurrentlyOnPromotion={pkg.isCurrentlyOnPromotion || false}
                discountPercentage={pkg.discountPercentage || 0}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
