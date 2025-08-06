import "./ReviewCarousel.css";
import CarouselReview from "./Carousel/CarouselReview";
import { useRef } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import useScrollArrows from "../../../hooks/useScrollArrows";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { goToReviews } from "../../../routes/coordinator";
import ramoOliveira from "../../../assets/ramo-de-oliveira.png";
import useIsMobile from "../../../hooks/useIsMobile";
import { fetchReviewsByPackageId } from "../../../store/actions/reviewActions";

const ReviewCarousel = ({ packageId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    reviews: filteredReviews, loading, error 
  } = useSelector((state) => state.reviews);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    if (packageId) {
      dispatch(fetchReviewsByPackageId(packageId));
    }
  }, [dispatch, packageId]);

  let averageRating = 0;
  if (filteredReviews && filteredReviews.length > 0) {
    const totalRating = filteredReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    averageRating = (totalRating / filteredReviews.length).toFixed(1);
  }

  const arrowsRef = useRef(null);
  const arrows = useScrollArrows(arrowsRef);

  const scrollCarousel = (direction, ref) => {
    if (!ref.current) return;

    const scrollAmount = isMobile ? 300 : 400;

    ref.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (!filteredReviews || filteredReviews.length === 0) {
    return (
      <div className="ReviewNotFound">Não possui nenhum comentário ainda!</div>
    );
  }

  if (loading) {
    return <div className="ReviewNotFound">Carregando comentários...</div>;
  }

  if (error) {
    return <div className="ReviewNotFound">Erro ao carregar os comentários.</div>;
  }

  return (
    <div className="ReviewContainer">
      {filteredReviews?.length > 0 && (
        <div className="reviews-wrapper">
          <h1>{averageRating}</h1>
          <img src={ramoOliveira} alt="Ramo de Oliveira" className="ramo" />
          {!isMobile && (
            <div>
              {arrows.left && (
                <div
                  className="review-arrow-left"
                  onClick={() => scrollCarousel("left", arrowsRef)}
                >
                  <FaArrowAltCircleLeft />
                </div>
              )}
              {arrows.right && (
                <div
                  className="review-arrow-right"
                  onClick={() => scrollCarousel("right", arrowsRef)}
                >
                  <FaArrowAltCircleRight />
                </div>
              )}
            </div>
          )}
          <div className="reviewCarousel-container">
            <CarouselReview filteredReviews={filteredReviews} ref={arrowsRef} />
          </div>

          <div style={{ marginBottom: "40px" }}>
            <div
              onClick={() => goToReviews(navigate, packageId, 0)}
              className="reviewButton"
            >
              Mostrar{" "}
              {filteredReviews.length === 1
                ? "mais sobre o"
                : `todos os ${filteredReviews.length}`}{" "}
              comentário{filteredReviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCarousel;
