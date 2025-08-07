import "./PackageCard.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { goToPackageDetails } from "../../routes/coordinator";
import imageUnavailable from "../../assets/imageUnavailable.jpg";
import { baseURLMedias } from "../../utils/baseURL";
import useIsOnRoute from "../../hooks/useIsOnRoute";
import HeartButton from "../HearthButton/HearthButton";

export const PackageCard = ({
  id,
  title,
  price,
  averageRating,
  imageSrc,
  isCurrentlyOnPromotion,
  discountPercentage,
}) => {
  const navigate = useNavigate();
  const isOnPackageDetailsPage = useIsOnRoute(["/history"]);

  const calculateDiscountedPrice = (price, discountPercentage) =>
    price * (1 - discountPercentage);

  const imageUrl =
    Array.isArray(imageSrc) && imageSrc.length > 0 && imageSrc[0].filePath
      ? `${baseURLMedias}${imageSrc[0].filePath}`
      : imageUnavailable;

  return (
    <Card
      sx={{
        width: 300,
        height: 260,
        borderRadius: "16px",
        position: "relative",
        backgroundColor: isOnPackageDetailsPage
          ? "var(--background-color)"
          : "var(--footer-bg)",
      }}
      className="packageCard"
      onClick={() => goToPackageDetails(navigate, id)}
    >
      <HeartButton packageId={id} />
      <CardMedia sx={{ height: 140 }} image={imageUrl} title={title} />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              color: "var(--primary-text-color)",
              mt: "-10px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
        <div className="package-info">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isCurrentlyOnPromotion ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: "var(--text-card-package)",
                  }}
                >
                  R$ {price}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--orange-avanade)",
                    fontWeight: "bold",
                    ml: -1,
                  }}
                >
                  R${" "}
                  {calculateDiscountedPrice(price, discountPercentage).toFixed(
                    2
                  )}
                </Typography>
              </>
            ) : (
              <Typography
                variant="h6"
                sx={{ color: "var(--primary-text-color)" }}
              >
                R$ {price}
              </Typography>
            )}
          </Box>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IoStar className="starIcon" />
            <Typography
              variant="body2"
              sx={{ color: "var(--text-card-package)" }}
            >
              {averageRating}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
