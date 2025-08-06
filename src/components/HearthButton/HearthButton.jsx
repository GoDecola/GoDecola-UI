import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addToWishlist, removeFromWishlist } from "../../store/actions/wishlistAction";
import { goToLogin } from "../../routes/coordinator";
import { Tooltip, Link, ClickAwayListener } from "@mui/material";

const HeartButton = ({ packageId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);
  const loading = useSelector((state) => state.wishlist.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated || !!state.auth.token);
  const [isFavorited, setIsFavorited] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

    useEffect(() => {
    const favorited = wishlist.some((item) => item.travelPackageId === packageId);
    setIsFavorited(favorited);
  }, [wishlist, packageId]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setTooltipOpen(true);
      return;
    }

    if (loading) {
      return;
    }

    try {
      if (isFavorited) {
        const wishlistItem = wishlist.find((item) => item.travelPackageId === packageId);
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
          setIsFavorited(false);
        }
      } else {
        await dispatch(addToWishlist(packageId)).unwrap();
        setIsFavorited(true); 
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleClickAway = () => {
    setTooltipOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Tooltip
        title={
          <span>
            Você precisa estar logado para adicionar aos favoritos.{" "}
            <Link
              component="button"
              onClick={(e) => {
                e.stopPropagation();
                goToLogin(navigate);
              }}
              sx={{ color: "var(--orange-avanade)", textDecoration: "underline" }}
            >
              Faça login
            </Link>
          </span>
        }
        open={tooltipOpen && !isAuthenticated}
        disableHoverListener
        arrow
        placement="top"
        PopperProps={{
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                altAxis: true,
                tether: false,
              },
            },
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        }}
        sx={{
          "& .MuiTooltip-tooltip": {
            backgroundColor: "var(--background-color, #fff)",
            color: "var(--primary-text-color, #000)",
            fontSize: "0.9rem",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--orange-avanade, #f28c38)",
            zIndex: 1500,
            maxWidth: 200,
          },
          "& .MuiTooltip-arrow": {
            color: "var(--background-color, #fff)",
            "&::before": {
              border: "1px solid var(--orange-avanade, #f28c38)",
            },
          },
        }}
      >
        <div
          onClick={handleToggleFavorite}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            zIndex: 1000,
            position: "relative",
          }}
        >
          {isFavorited ? (
            <FaHeart className="hearthIcon" style={{ color: "red" }} />
          ) : (
            <FaRegHeart className="hearthIcon2" />
          )}
        </div>
      </Tooltip>
    </ClickAwayListener>
  );
};

export default HeartButton;