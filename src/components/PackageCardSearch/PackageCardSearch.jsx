import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IoStar } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { goToPackageDetails } from "../../routes/coordinator";
import imageUnavailable from "../../assets/imageUnavailable.jpg";
import { baseURLMedias } from "../../utils/baseURL";

export const PackageCardSearch= ({
  id,
  title,
  price,
  averageRating,
  imageSrc,
  isCurrentlyOnPromotion,
  discountPercentage,
  startDate,
  endDate,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

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
        backgroundColor: "var(--footer-bg)",
      }}
      className="packageCard"
      onClick={() => goToPackageDetails(navigate, id)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        style={{ cursor: "pointer" }}
      >
        {isFavorited ? (
          <FaHeart className="hearthIcon" />
        ) : (
          <FaRegHeart className="hearthIcon2" />
        )}
      </div>
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
            variant="h6"
            component="div"
            sx={{ color: "var(--primary-text-color)", mt: "-10px", lineHeight: 1, }}
          >
            {title}
          </Typography>
          <Typography            
            variant="body2"
            component="div"
            sx={{ color: "var(--primary-text-color)", mt: "5px" }}
          >
           Disponível de {startDate} à {endDate}
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
