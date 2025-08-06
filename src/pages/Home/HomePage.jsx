import "./HomePage.css";
import Carousel from "../../components/Home/Carousel/CarouselHome";
import { useState, useEffect, useRef, useMemo } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import useScrollArrows from "../../hooks/useScrollArrows";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import { goToSearchPackages } from "../../routes/coordinator";
import { IoSearch } from "react-icons/io5";
import useShuffledArray from "../../hooks/useShuffledArray";
import useIsMobile from "../../hooks/useIsMobile";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchTravelPackages } from "../../store/actions/travelPackagesActions";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("NATIONAL");
  const isMobile = useIsMobile();
  const { packages, loading, error } = useSelector(
    (state) => state.travelPackages,
    shallowEqual
  );
  
  useEffect(() => {
    dispatch(fetchTravelPackages());
  }, [dispatch]);

  const nationalFiltered = useMemo(
    () => packages?.filter((pkg) => pkg.packageType === "Nacional") || [],
    [packages]
  );
  const internationalFiltered = useMemo(
    () => packages?.filter((pkg) => pkg.packageType === "Internacional") || [],
    [packages]
  );
  const promoFiltered = useMemo(
    () => packages?.filter((pkg) => pkg.isCurrentlyOnPromotion === true) || [],
    [packages]
  );

  // Shuffle filtered arrays
  const nationalPackages = useShuffledArray(nationalFiltered);
  const internationalPackages = useShuffledArray(internationalFiltered);
  const promoPackages = useShuffledArray(promoFiltered);

  const nationalCarouselRef = useRef(null);
  const internationalCarouselRef = useRef(null);
  const promoCarouselRef = useRef(null);

  const nationalArrows = useScrollArrows(nationalCarouselRef);
  const internationalArrows = useScrollArrows(internationalCarouselRef);
  const promoArrows = useScrollArrows(promoCarouselRef);

  // Função para rolar o carrossel
  const scrollCarousel = (direction, ref) => {
    if (!ref.current) return;

    const scrollAmount = isMobile ? 300 : 400;

    ref.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Forçar re-check das setas após trocar de aba
  useEffect(() => {
    const timer = setTimeout(() => {
      nationalArrows.checkScroll();
      internationalArrows.checkScroll();
      promoArrows.checkScroll();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeTab, internationalArrows, nationalArrows, promoArrows]);

  return (
    <div className="homepage-container">
      <Card
        className="search-button"
        sx={{
          maxWidth: 360,
          borderRadius: "16px",
          backgroundColor: "var(--footer-bg)",
          color: "var(--text-card-package)",
        }}
        onClick={() => goToSearchPackages(navigate)}
      >
        <IoSearch />
        <p>Inicie sua busca</p>
      </Card>

      {/* Loading and Error States */}
      {loading && <div className="loading-message">Carregando pacotes...</div>}
      {error && <div className="error-message">Erro: {error}</div>}
      {!loading && !error && packages?.length === 0 && (
        <div className="no-packages-message">
          Nenhum pacote disponível no momento.
        </div>
      )}

      {/* --- Navegação Tabs --- */}
      {!loading && !error && packages?.length > 0 && (
        <div className="tab-navigation-container">
          <h2
            className={`tab-h2 ${activeTab === "NATIONAL" ? "active" : ""}`}
            onClick={() => setActiveTab("NATIONAL")}
          >
            {isMobile ? "Nacionais" : "Viagens Nacionais"}
          </h2>
          <span className="tab-separator">|</span>
          <h2
            className={`tab-h2 ${
              activeTab === "INTERNATIONAL" ? "active" : ""
            }`}
            onClick={() => setActiveTab("INTERNATIONAL")}
          >
            {isMobile ? "Internacionais" : "Viagens Internacionais"}
          </h2>
        </div>
      )}

      {/* --- Carrossel Nacional --- */}
      {activeTab === "NATIONAL" &&
        !loading &&
        !error &&
        nationalPackages.length > 0 && (
          <div className="carousel-wrapper">
            {!isMobile && (
              <>
                {nationalArrows.left && (
                  <div
                    className="carousel-arrow-left"
                    onClick={() => scrollCarousel("left", nationalCarouselRef)}
                  >
                    <FaArrowAltCircleLeft />
                  </div>
                )}
                {nationalArrows.right && (
                  <div
                    className="carousel-arrow-right"
                    onClick={() => scrollCarousel("right", nationalCarouselRef)}
                  >
                    <FaArrowAltCircleRight />
                  </div>
                )}
              </>
            )}
            <div className="carousel-container">
              <Carousel packages={nationalPackages} ref={nationalCarouselRef} />
            </div>
          </div>
        )}

      {/* --- Carrossel Internacional --- */}
      {activeTab === "INTERNATIONAL" &&
        !loading &&
        !error &&
        internationalPackages.length > 0 && (
          <div className="carousel-wrapper">
            {!isMobile && (
              <>
                {internationalArrows.left && (
                  <div
                    className="carousel-arrow-left"
                    onClick={() =>
                      scrollCarousel("left", internationalCarouselRef)
                    }
                  >
                    <FaArrowAltCircleLeft />
                  </div>
                )}
                {internationalArrows.right && (
                  <div
                    className="carousel-arrow-right"
                    onClick={() =>
                      scrollCarousel("right", internationalCarouselRef)
                    }
                  >
                    <FaArrowAltCircleRight />
                  </div>
                )}
              </>
            )}
            <div className="carousel-container">
              <Carousel
                packages={internationalPackages}
                ref={internationalCarouselRef}
              />
            </div>
          </div>
        )}

      {/* --- Pacotes em Promoção --- */}
      {!loading && !error && promoPackages.length > 0 && (
        <>
          <h2 className="h2Promo">Pacotes em Promoção</h2>
          <div className="carousel-wrapper">
            {!isMobile && (
              <>
                {promoArrows.left && (
                  <div
                    className="carousel-arrow-left"
                    onClick={() => scrollCarousel("left", promoCarouselRef)}
                  >
                    <FaArrowAltCircleLeft />
                  </div>
                )}
                {promoArrows.right && (
                  <div
                    className="carousel-arrow-right"
                    onClick={() => scrollCarousel("right", promoCarouselRef)}
                  >
                    <FaArrowAltCircleRight />
                  </div>
                )}
              </>
            )}
            <div className="carousel-container">
              <Carousel packages={promoPackages} ref={promoCarouselRef} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
